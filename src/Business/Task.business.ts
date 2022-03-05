import { validate, ValidationError } from "class-validator";
import { getRepository, Repository } from "typeorm";
import { Task } from "../models/Task";
import { User } from "../models/User";
import { authenticationData, Authenticator } from "../services/TokenGenerator";
import { TaskRequest } from "../services/types";

export class TaskBusiness {
  create = async (
    token: string,
    { name, description, limitDate, users }: TaskRequest
  ): Promise<Task | Error> => {
    const repository: Repository<Task> = getRepository(Task);
    if (await repository.findOne({ name }))
      return new Error("Task already exists");

    const accessToken: authenticationData =
      new Authenticator().getUnsafeTokenData(token);

     const repositoryUser = getRepository(User);
    const findOwner = await repositoryUser.findOne(accessToken.id);
    if (!findOwner) return new Error("User not Found");

    const findUser = (
      await Promise.all(
        users.map((user) => repositoryUser.findOne({ id: user }))
      )
    ).filter(Boolean);

    if (!findUser.length) return new Error("Users Not Found.");

    const createTask: Task = repository.create({
      name,
      description,
      limitDate,
      users: findUser,
      creatorUser: findOwner,
    });

    const errors: ValidationError[] = await validate(createTask);
    if (errors.length)
      return new Error(
        JSON.stringify(
          errors.map(
            (v: ValidationError): { [type: string]: string } => v.constraints
          )
        )
      );

    await repository.save(createTask);
    return createTask;
  };

  read = async (): Promise<Task[] | Error> => {
    const repository: Repository<Task> = getRepository(Task);
    const userTasks: Task[] = await repository.find({
      relations: ["creatorUser", "users"],
    });
    if (!userTasks) return new Error("Task not found.");

    return userTasks;
  };

  insertUsers = async (
    token: string,
    idTask: string,
    ids: string[]
  ): Promise<Task | Error> => {
    const repository = getRepository(Task);
    const repositoryUser = getRepository(User);

    const accessToken: authenticationData =
      new Authenticator().getUnsafeTokenData(token);

    const findOwner = await repositoryUser.findOne(accessToken.id);
    if (!findOwner) return new Error("User not Found");

    const task = await repository.findOne({
      relations: ["creatorUser", "users"],
      where: {
        id: idTask,
        creatorUser: {
          id: findOwner.id,
        },
      },
    });

    if (!task) return new Error("Task not found");

    const findUser = (
      await Promise.all(ids.map((user) => repositoryUser.findOne({ id: user })))
    )
      .filter(Boolean)
      .filter(({ id }) => !task.users.find((user) => user.id === id));

    if (!findUser.length)
      return new Error("Users already inserted or not found.");

    task.users = [...task.users, ...findUser];
    return await repository.save(task);
  };

  deleteUsers = async (
    token: string,
    idTask: string,
    ids: string[]
  ): Promise<Task | Error> => {
    const repository = getRepository(Task);
    const repositoryUser = getRepository(User);

    const accessToken: authenticationData =
      new Authenticator().getUnsafeTokenData(token);

    const findOwner = await repositoryUser.findOne(accessToken.id);
    if (!findOwner) return new Error("User not Found");

    const task = await repository.findOne({
      relations: ["creatorUser", "users"],
      where: {
        id: idTask,
        creatorUser: {
          id: findOwner.id,
        },
      },
    });

    if (!task) return new Error("Task not found");

    task.users = task.users.filter((user) => !ids.includes(user.id));
    return await repository.save(task);
  };
}

import { validate, ValidationError } from "class-validator";
import { getRepository, Repository } from "typeorm";
import { ITask, Task } from "../models/Task";
import { profiles, User } from "../models/User";
import { authenticationData, Authenticator } from "../services/TokenGenerator";
import { TaskRequest } from "../services/types";

export class TaskBusiness {
  create = async (
    token: string,
    { name, description, limitDate, users }: TaskRequest
  ): Promise<Task | Error> => {
    const repository: Repository<Task> = getRepository(Task);
    const repositoryUser: Repository<User> = getRepository(User);
    if (await repository.findOne({ name }))
      return new Error("Task already exists");

    const accessToken: authenticationData =
      new Authenticator().getUnsafeTokenData(token);

    const findOwner = await repositoryUser.findOne(accessToken.id);
    if (!findOwner) return new Error("User not Found");

    const findUser: User[] = (
      await Promise.all(
        users.map((user) => repositoryUser.findOne({ id: user }))
      )
    )
      .filter(Boolean)
      .filter((user) => user.id !== findOwner.id);

    const limiteDate = new Date(limitDate);
    limiteDate.setHours(23, 59, 59);

    const createTask: Task = repository.create({
      name,
      description,
      limitDate: limiteDate,
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

  read = async (token: string): Promise<Task[] | Error> => {
    const repository: Repository<Task> = getRepository(Task);
    const repositoryUser: Repository<User> = getRepository(User);

    const accessToken: authenticationData =
      new Authenticator().getUnsafeTokenData(token);

    const user: User = await repositoryUser.findOne(accessToken.id);
    if (!user) return new Error("User not Found");

    let tasks: Task[];
    if ([profiles.ADMINISTRATOR, profiles.MODERATOR].includes(user.profile)) {
      tasks = await repository.find({
        relations: ["creatorUser", "users"],
      });
    } else {
      const checkUserTask = (
        await repository.find({
          relations: ["creatorUser", "users"],
        })
      ).filter(
        (task) =>
          task.creatorUser.id === user.id ||
          task.users.some((userTask) => userTask.id === user.id)
      );

      if (!checkUserTask.length) return new Error("Task not found.");

      tasks = checkUserTask;
    }

    return tasks;
  };

  insertUsers = async (
    token: string,
    idTask: string,
    ids: string[]
  ): Promise<Task | Error> => {
    const repository: Repository<Task> = getRepository(Task);
    const repositoryUser: Repository<User> = getRepository(User);

    const accessToken: authenticationData =
      new Authenticator().getUnsafeTokenData(token);

    const findOwner: User = await repositoryUser.findOne(accessToken.id);
    if (!findOwner) return new Error("User not Found");
    let task: Task;
    if (
      [profiles.ADMINISTRATOR, profiles.MODERATOR].includes(findOwner.profile)
    ) {
      task = await repository.findOne({
        relations: ["creatorUser", "users"],
      });
    } else {
      const checkUserTask = await repository.findOne({
        where: {
          id: idTask,
        },
        relations: ["creatorUser", "users"],
      });

      if (!checkUserTask) return new Error("Task not found.");

      if (
        checkUserTask.creatorUser.id === findOwner.id ||
        checkUserTask.users.some((user) => user.id === findOwner.id)
      )
        task = checkUserTask;
    }

    if (!task) return new Error("Task not found");

    const findUser: User[] = (
      await Promise.all(ids.map((user) => repositoryUser.findOne({ id: user })))
    )
      .filter(Boolean)
      .filter((user) => user.id !== task.creatorUser.id)
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
    const repository: Repository<Task> = getRepository(Task);
    const repositoryUser: Repository<User> = getRepository(User);

    const accessToken: authenticationData =
      new Authenticator().getUnsafeTokenData(token);

    const findOwner: User = await repositoryUser.findOne(accessToken.id);
    if (!findOwner) return new Error("User not Found");

    const task: Task = await repository.findOne({
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

  alterStatus = async (
    token: string,
    idTask: string,
    statusTask: ITask,
    ids: string[]
  ): Promise<string | Error> => {
    const repositoryTask: Repository<Task> = getRepository(Task);
    const repositoryUser: Repository<User> = getRepository(User);
    const accessToken: authenticationData =
      new Authenticator().getUnsafeTokenData(token);

    const userIsAuthenticated = await repositoryUser.findOne(accessToken.id);
    if (!userIsAuthenticated) return new Error("User not found");

    const checkUserTask: Task = await repositoryTask.findOne({
      where: {
        id: idTask,
      },
      relations: ["creatorUser", "users"],
    });

    if (!checkUserTask) return new Error("Task not found.");

    const currentDate = Date.now();
    const validDate = checkUserTask.limitDate;
    if (currentDate > validDate.getTime())
      return new Error("You cannot change a task after the deadline.");

    if (
      checkUserTask.creatorUser.id !== userIsAuthenticated.id ||
      checkUserTask.users.some((user) => user.id !== userIsAuthenticated.id)
    )
      return new Error(
        "You are not allowed to change this task as you are not the servant or part of it."
      );

    let alterStatus: ITask = checkUserTask.status;
    if (
      (alterStatus === "done" && statusTask !== "done") ||
      alterStatus === statusTask
    )
      return new Error("The value provided is not valid or the task is done.");

    checkUserTask.status = statusTask ? statusTask : checkUserTask.status;

    repositoryTask.save(checkUserTask);
    return `Task successfully changed!`;
  };
}

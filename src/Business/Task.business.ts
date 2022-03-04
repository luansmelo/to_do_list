import { validate, ValidationError } from "class-validator";
import { getRepository, Repository } from "typeorm";
import { Task } from "../models/Task";

type TaskRequest = {
  name: string;
  description: string;
  limitDate: Date;
};

export class TaskBusiness {
  create = async ({
    name,
    description,
    limitDate,
  }: TaskRequest): Promise<Task | Error> => {
    const repository: Repository<Task> = getRepository(Task);
    if (await repository.findOne({ name }))
      return new Error("User already exists");

    const createTask: Task = repository.create({
      name,
      description,
      limitDate,
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
}

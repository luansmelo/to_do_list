import { Request, Response } from "express";
import { TaskBusiness } from "../Business/Task.business";
import { Task } from "../models/Task";
import { ensureInterface } from "@srhenry/type-utils";
import { taskRequest } from "../services/types";

class TaskController {
  constructor(private taskRepository = new TaskBusiness()) {}

  createTask = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const {
      name,
      description,
      limitDate,
      users = [],
    } = ensureInterface(request.body, taskRequest);
    const authentication: string = request.headers.authorization as string;

    const task: TaskBusiness = this.taskRepository;
    const result: Task | Error = await task.create(authentication, {
      name,
      description,
      limitDate,
      users,
    });

    if (result instanceof Error)
      return response.status(400).json(result.message);
    return response.status(201).json(result);
  };

  findTask = async (request: Request, response: Response) => {
    const task = this.taskRepository;
    const authecation: string = request.headers.authorization as string;
    const resultTask: Task[] | Error = await task.read(authecation);

    if (resultTask instanceof Error)
      return response.status(400).json(resultTask.message);
    return response.status(201).json(resultTask);
  };

  deleteUsers = async (request: Request, response: Response) => {
    const { idTask, ids } = request.body;
    const task = this.taskRepository;
    const authentication = request.headers.authorization as string;

    const resultTask = await task.deleteUsers(authentication, idTask, ids);

    if (resultTask instanceof Error)
      return response.status(400).json(resultTask.message);
    return response.json(resultTask);
  };

  insertUsers = async (request: Request, response: Response) => {
    const { idTask, ids } = request.body;
    const task = this.taskRepository;
    const authecation = request.headers.authorization as string;
    const insertUserTask = await task.insertUsers(authecation, idTask, ids);

    if (insertUserTask instanceof Error)
      return response.status(400).json(insertUserTask.message);
    return response.json(insertUserTask);
  };
}

export { TaskController };

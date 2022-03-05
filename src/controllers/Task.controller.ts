import { Request, Response } from "express";
import { TaskBusiness } from "../Business/Task.business";
import { Task } from "../models/Task";

export class TaskController {
  createTask = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const { name, description, limitDate } = request.body;
    const { auth } = request.headers;

    
    const task: TaskBusiness = new TaskBusiness();
    const result: Task | Error = await task.create({
      name,
      description,
      limitDate,
    });

    if (result instanceof Error)
      return response.status(400).json(result.message);
    return response.status(201).json(result);
  };
}

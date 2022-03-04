import { Router, Request, Response } from "express";
import { getRepository, Repository } from "typeorm";
import { Task } from "../entity/Task";

const taskRouter = Router();

taskRouter.post(
  "/",
  async (request: Request, response: Response): Promise<Response> => {
    try {
      const repository: Repository<Task> = getRepository(Task);
      const createTask: any = await repository.save(request.body);
      return response.status(201).json(createTask);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
);

taskRouter.get(
  "/",
  async (request: Request, response: Response): Promise<Response> => {
    try {
      const repository: Repository<Task> = getRepository(Task);
      const relation: Task[] = await repository.find({ relations: ["users"] });
      response.status(201).json(relation);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
);

taskRouter.get(
  "/:name",
  async (request: Request, response: Response): Promise<Response> => {
    try {
      const repository = getRepository(Task);
      const findName = await repository.find({
        where: {
          name: request.params.name,
        },
      });

      if (!findName) throw new Error("User not found");

      response.json(findName);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
);

export { taskRouter };

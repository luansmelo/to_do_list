import { Router } from "express";
import { TaskController } from "../controllers/Task.controller";
import UserController from "../controllers/User.controller";

const routes = Router();
routes.post("/user/singup", UserController.singup);
routes.post("/user/login", UserController.login);
routes.get("/user/:id", UserController.findUserById);
routes.put("/user/edit/:id", UserController.updateUserById);
routes.delete("/user/:id", UserController.deleteUserById);

// Router the task

routes.post("/task", new TaskController().createTask);

export { routes };

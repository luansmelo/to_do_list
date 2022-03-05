import { Router } from "express";
import { TaskController } from "../controllers/Task.controller";
import { UserController } from "../controllers/User.controller";

const userRouter: any = new UserController();

const routes = Router();
routes.post("/user/singup", userRouter.singup);
routes.post("/user/auth", userRouter.auth);
routes.post("/user/login", userRouter.login);
routes.get("/user/:id", userRouter.findUserById);
routes.put("/user/edit/:id", userRouter.updateUserById);
routes.delete("/user/:id", userRouter.deleteUserById);

// Router the task

routes.post("/task", new TaskController().createTask);

export { routes };

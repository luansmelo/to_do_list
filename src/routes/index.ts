import { Router } from "express";
import { TaskController } from "../controllers/Task.controller";
import { UserController } from "../controllers/User.controller";
import { authenticated } from "../middlewares/Authenticated";

const userRouter: any = new UserController();
const taskRouter = new TaskController();

const routes = Router();
routes.post("/user/login", userRouter.login);
routes.post("/user/singup", userRouter.singup);
routes.post("/user/auth", authenticated, userRouter.auth);
routes.get("/user/:id", authenticated, userRouter.findUserById);
routes.put("/user/edit/:id", authenticated, userRouter.updateUserById);
routes.delete("/user/:id", authenticated, userRouter.deleteUserById);

// Router the task

routes.post("/task", authenticated, taskRouter.createTask);
routes.post("/task/deleteUsers", authenticated, taskRouter.deleteUsers);
routes.post("/task/insertUsers", authenticated, taskRouter.insertUsers);
routes.get("/task/find", authenticated, taskRouter.findTask);

export { routes };

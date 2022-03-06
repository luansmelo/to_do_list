import { profiles, allProfiles } from "../models/User";
import { Router } from "express";
import { TaskController } from "../controllers/Task.controller";
import { UserController } from "../controllers/User.controller";
import { allowed } from "../middlewares/Allowed";
import { authenticated } from "../middlewares/Authenticated";

const userRouter: UserController = new UserController();
const taskRouter: TaskController = new TaskController();

const routes = Router();
routes.post("/user/login", userRouter.login);
routes.post("/user/singup", userRouter.singup);
routes.post("/user/auth", authenticated, allowed(allProfiles), userRouter.auth);
routes.get(
  "/user/:id",
  authenticated,
  allowed(allProfiles),
  userRouter.findUserById
);
routes.put(
  "/user/edit/:id",
  authenticated,
  allowed([profiles.MODERATOR, profiles.ADMINISTRATOR]),
  userRouter.updateUserById
);
routes.delete(
  "/user/:id",
  authenticated,
  allowed(allProfiles),
  userRouter.deleteUserById
);

// Router the task

routes.post("/task", authenticated, taskRouter.createTask);
routes.post("/task/deleteUsers", authenticated, taskRouter.deleteUsers);
routes.post("/task/insertUsers", authenticated, taskRouter.insertUsers);
routes.get("/task/find", authenticated, taskRouter.findTask);

export { routes };

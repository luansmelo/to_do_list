import { Request, Response } from "express";
import { UserBusiness } from "../Business/User.business";
import { User } from "../models/User";

class UserController {
  constructor(private userRepository = new UserBusiness()) {}

  singup = async (request: Request, response: Response): Promise<Response> => {
    const { name, nickname, email, password } = request.body;
    const user: UserBusiness = this.userRepository;
    const result: User | Error = await user.create({
      name,
      nickname,
      email,
      password,
    });

    if (result instanceof Error)
      return response.status(400).json(result.message);

    return response.status(201).json({ result });
  };

  login = async (request: Request, response: Response): Promise<Response> => {
    const { email, password } = request.body;
    const loginAceess = this.userRepository;
    const sessionUser = await loginAceess.userLogin({ email, password });
    if (sessionUser instanceof Error)
      return response.status(400).json(sessionUser.message);

    return response.status(200).json(sessionUser);
  };

  auth = async (request: Request, response: Response): Promise<Response> => {
    const { refresh_token } = request.body;
    const refreshTokenUser = this.userRepository;
    const token = await refreshTokenUser.refreshToken(refresh_token);

    if (token instanceof Error) return response.status(400).json(token.message);
    return response.json(token);
  };

  findUserById = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const { id } = request.params;
    const user: UserBusiness = this.userRepository;
    const authecation: string = request.headers.authorization as string;
    const result: User | Error = await user.read(authecation, { id });

    if (result instanceof Error)
      return response.status(400).json(result.message);

    const { name, nickname } = result;
    return response.status(201).json({ name, nickname });
  };

  updateUserById = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const { id } = request.params;
    const { name, nickname, email, password } = request.body;
    const authentication: string = request.headers.authorization as string;

    const userUpdate = this.userRepository;
    const result = await userUpdate.update(authentication, {
      id,
      name,
      nickname,
      email,
      password,
    });

    if (result instanceof Error)
      return response.status(400).json(result.message);
    return response.status(200).json("User successfully updated.");
  };

  deleteUserById = async (request: Request, response: Response) => {
    const { id } = request.params;
    const authecation: string = request.headers.authorization as string;
    const userDelete = this.userRepository;
    const result = await userDelete.delete(authecation, { id });

    if (result instanceof Error)
      return response.status(200).json(result.message);
    return response.status(200).json("User successfully deleted.");
  };

  listAll = async (request: Request, response: Response) => {
    const user = this.userRepository;
    const listAllUsers: User[] = await user.listAll();

    return response.status(200).json(listAllUsers);
  };
}

export { UserController };

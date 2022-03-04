import { validate, ValidationError } from "class-validator";
import { getRepository, Repository } from "typeorm";
import { User } from "../models/User";
import { HashManager } from "../services/hashManager";
import { Authenticator } from "../services/TokenGenerator";
import {
  UserRequest,
  UserResponse,
  UserRequestById,
  UserRequestLogin,
} from "../services/types";

export class UserBusiness {
  create = async ({
    name,
    nickname,
    email,
    password,
  }: UserRequest): Promise<User | Error> => {
    const repository: Repository<User> = getRepository(User);

    const findUserExist: User = await repository.findOne({ email });
    if (findUserExist) return new Error("User already exists");
    const cipherPassword: string = new HashManager().generateHash(password);
    const createUser: User = repository.create({
      name,
      nickname,
      email,
      password: cipherPassword,
    });

    const errors: ValidationError[] = await validate(createUser);
    if (errors.length)
      return new Error(
        JSON.stringify(
          errors.map(
            (v: ValidationError): { [type: string]: string } => v.constraints
          )
        )
      );

    await repository.save(createUser);
    return createUser;
  };

  userLogin = async ({
    email,
    password,
  }: UserRequestLogin): Promise<UserResponse | Error> => {
    const repository: Repository<User> = getRepository(User);
    const user: User = await repository.findOne({ email });
    if (!user) return new Error("User not found.");

    const isPasswordCorrect: boolean = new HashManager().compareHash(
      password,
      user.password
    );

    if (!isPasswordCorrect) return new Error("Invalid credentials.");

    const token: string = new Authenticator().generateToken({
      id: user.id,
    });

    const { name, nickname } = user;

    return { user: { name, nickname, email }, token };
  };

  read = async ({ id }: UserRequestById): Promise<User | Error> => {
    const repository: Repository<User> = getRepository(User);
    const findUserById: User = await repository.findOne({ id });
    if (!findUserById) return new Error("user Not Found");
    return findUserById;
  };

  update = async ({
    id,
    name,
    nickname,
    email,
    password,
  }: UserRequest): Promise<User | Error> => {
    const repository: Repository<User> = getRepository(User);
    const updateUser: User = await repository.findOne({ id });
    if (!updateUser) return new Error("provided id not found.");
    updateUser.name = name ? name : updateUser.name;
    updateUser.nickname = nickname ? nickname : updateUser.nickname;
    updateUser.email = email ? email : updateUser.email;
    updateUser.password = password ? password : updateUser.password;

    await repository.save(updateUser);
  };

  delete = async ({ id }: UserRequestById): Promise<Error | User> => {
    const repository: Repository<User> = getRepository(User);
    const deleteUserById: User | Error = await repository.findOne({ id });
    if (!deleteUserById) return new Error("provided id not found.");
    await repository.delete({ id });
  };
}

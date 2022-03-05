import * as dayjs from "dayjs";
import { validate, ValidationError } from "class-validator";
import { getRepository, Repository } from "typeorm";
import { RefreshToken } from "../models/RefreshToken";
import { User } from "../models/User";
import { GenerateRefreshToken } from "../provider/GenerateRefreshToken";
import { HashManager } from "../services/hashManager";
import { authenticationData, Authenticator } from "../services/TokenGenerator";
import {
  UserRequest,
  UserResponse,
  UserRequestById,
  UserRequestLogin,
  UserReturnToken,
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
  }: UserRequestLogin): Promise<any | Error> => {
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

    const genereteRefreshToken: GenerateRefreshToken =
      new GenerateRefreshToken();
    const refreshToken: RefreshToken = await genereteRefreshToken.execute(
      user.id
    );

    return { token, refreshToken };
  };

  read = async ({ id }: UserRequestById): Promise<User | Error> => {
    const repository: Repository<User> = getRepository(User);
    const findUserById: User = await repository.findOne({ id });
    if (!findUserById) return new Error("user Not Found");
    return findUserById;
  };

  update = async (
    token: string,
    { id, name, nickname, email, password }: UserRequest
  ): Promise<User | Error> => {
    const repository: Repository<User> = getRepository(User);
    const updateUser: User = await repository.findOne({ id });
    const accessToken: authenticationData =
      new Authenticator().getUnsafeTokenData(token);

    if (accessToken === null) return new Error("invalid token");
    if (!updateUser) return new Error("provided id not found.");
    updateUser.name = name ? name : updateUser.name;
    updateUser.nickname = nickname ? nickname : updateUser.nickname;
    updateUser.email = email ? email : updateUser.email;
    updateUser.password = password ? password : updateUser.password;

    await repository.save(updateUser);
  };

  delete = async (
    token: string,
    { id }: UserRequestById
  ): Promise<Error | User> => {
    const repository: Repository<User> = getRepository(User);

    const accessToken: authenticationData =
      new Authenticator().getUnsafeTokenData(token);

    if (accessToken === null) return new Error("invalid token");

    const deleteUserById: User | Error = await repository.findOne({ id });
    if (!deleteUserById) return new Error("provided id not found.");
    await repository.delete({ id });
  };

  refreshToken = async (
    refresh_token: string
  ): Promise<UserReturnToken | Error | UserResponse> => {
    const refreshTokenRepository = getRepository(RefreshToken);
    const findTokenId = await refreshTokenRepository.findOne({
      id: refresh_token,
    });
    if (!findTokenId) return new Error("Refresh token invalid");

    const accessToken = getRepository(RefreshToken);
    await accessToken.delete({ user_id: findTokenId.id });

    const refreshTokenExpired: boolean = dayjs().isAfter(
      dayjs.unix(findTokenId.expiresIn)
    );

    const newRepository: Repository<RefreshToken> = getRepository(RefreshToken);
    if (refreshTokenExpired) {
      await newRepository.delete({
        id: findTokenId.id,
      });

      const newRefreshToken: GenerateRefreshToken = new GenerateRefreshToken();
      const resultRefreshToken: RefreshToken = await newRefreshToken.execute(
        findTokenId.id
      );

      return { findTokenId, resultRefreshToken };
    }

    const token: string = new Authenticator().generateToken({
      id: findTokenId.user_id,
    });

    return { token };
  };
}

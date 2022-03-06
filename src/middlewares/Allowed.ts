import { Request, Response, NextFunction } from "express";
import { Repository, getRepository } from "typeorm";
import { profiles, User } from "../models/User";
import { authenticationData, Authenticator } from "../services/TokenGenerator";

export function allowed(profiles: profiles[]) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const authentication: string = request.headers.authorization as string;

    const accessToken: authenticationData =
      new Authenticator().getUnsafeTokenData(authentication);
    const repository: Repository<User> = getRepository(User);
    const user = await repository.findOne({ id: accessToken.id });
    if (!user) return response.status(400).json({ message: "User not found." });

    if(!profiles.includes(user.profile)) return response.status(403).json({message: "forbidden access"})
    return next()
  };
}

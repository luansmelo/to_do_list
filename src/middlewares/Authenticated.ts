import { Request, Response, NextFunction } from "express";
import { authenticationData, Authenticator } from "../services/TokenGenerator";

function authenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authentication: string = request.headers.authorization as string;

  const accessToken: authenticationData = new Authenticator().getTokenData(
    authentication
  );

  if (accessToken === null)
    return response.status(400).json({ message: "invalid token" });

  next();
}

export { authenticated };

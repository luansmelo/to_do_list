import * as jwt from "jsonwebtoken";
export interface authenticationData {
  id: string;
}

export class Authenticator {
  public generateToken = (payload: authenticationData) => {
    const token: string = jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: "15s",
    });
    return token;
  };

  public getTokenData = (token: string): authenticationData | null => {
    try {
      const tokenData = jwt.verify(token, process.env.JWT_KEY) as any;
      return {
        id: tokenData.id,
      };
    } catch (error) {
      return null;
    }
  };
}

import { getRepository, Repository } from "typeorm";
import { RefreshToken } from "../models/RefreshToken";
import * as dayjs from "dayjs";

class GenerateRefreshToken {
  async execute(userid: string): Promise<RefreshToken> {
    const expiresIn: number = dayjs().add(900, "second").unix();
    const repository: Repository<RefreshToken> = getRepository(RefreshToken);
    const genereteRefreshToken: RefreshToken = repository.create({
      user_id: userid,
      expiresIn,
    });

    await repository.save(genereteRefreshToken);
    return genereteRefreshToken;
  }
}

export { GenerateRefreshToken };

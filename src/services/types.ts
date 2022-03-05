import { Schema, GetTypeGuard } from "@srhenry/type-utils";

type UserResponse = {
  token: string;
};

type UserReturnToken = {
  findTokenId: {
    id: string;
    expiresIn: number;
    user_id: string;
  };
  resultRefreshToken: {
    id: string;
    expiresIn: number;
    user_id: string;
  };
};

type UserRequest = {
  id?: string;
  name: string;
  nickname: string;
  email: string;
  password: string;
};

type UserRequestById = {
  id: string;
};

type UserRequestLogin = {
  email: string;
  password: string;
};


function isDate(propDate: unknown): propDate is Date {
  return propDate instanceof Date;
}

const taskRequest = Schema.object({
  name: Schema.string(),
  description: Schema.string(),
  limitDate: Schema.string(),
  users: Schema.array(Schema.string()),
});

type TaskRequest = GetTypeGuard<typeof taskRequest>


export {
  UserResponse,
  UserRequest,
  UserRequestById,
  UserRequestLogin,
  UserReturnToken,
  TaskRequest,
  taskRequest,
};

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

export { UserResponse, UserRequest, UserRequestById, UserRequestLogin, UserReturnToken };

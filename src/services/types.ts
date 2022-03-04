type UserResponse = {
  user: Partial<UserRequest>; // partial leaves all typing optional.
  token: string;
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

export { UserResponse, UserRequest, UserRequestById, UserRequestLogin };

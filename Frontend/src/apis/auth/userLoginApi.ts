import { AxiosRequestConfig } from 'axios';
import { User } from '../../configs/interfaces';
import axiosInit from '../../services/axios';

interface Response {
  data: {
    data: {
      token: string;
      user: User;
    };
  };
}

const userLoginApi = async (
  {
    email,
    password,
  }: {
    email: string;
    password: string;
  },
  config?: AxiosRequestConfig
): Promise<Response['data']> => {
  try {
    // Post Credentials
    const res: Response = await axiosInit.post(
      '/api/users/login',
      {
        email,
        password,
      },
      config
    );
    // resolve promise with user User Data and Token
    return Promise.resolve(res.data);
  } catch (e) {
    // reject promise with error
    return Promise.reject(e);
  }
};

export default userLoginApi;

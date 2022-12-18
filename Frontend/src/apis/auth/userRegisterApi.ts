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

const userRegisterApi = async (
  formData: FormData,
  config?: AxiosRequestConfig
): Promise<Response['data']> => {
  try {
    // Post Credentials
    const res: Response = await axiosInit.post(
      'api/users/createAccount',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...config,
      }
    );
    // resolve promise with user User Data and Token
    return Promise.resolve(res.data);
  } catch (e) {
    // reject promise with error
    return Promise.reject(e);
  }
};

export default userRegisterApi;

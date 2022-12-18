import { AxiosRequestConfig } from 'axios';
import { User } from 'src/configs/interfaces';
import axiosInit from 'src/services/axios';

interface Response {
  data: {
    data: {
      user: User;
    };
  };
}

const updateProfileApi = async (
  formData: FormData,
  config?: AxiosRequestConfig
): Promise<Response['data']> => {
  try {
    // Post Credentials
    const res: Response = await axiosInit.patch(
      '/api/users/updateProfile',
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

export default updateProfileApi;

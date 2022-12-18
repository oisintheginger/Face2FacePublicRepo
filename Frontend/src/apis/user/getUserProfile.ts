import { AxiosRequestConfig } from 'axios';
import { User } from '../../configs/interfaces';
import axiosInit from '../../services/axios';

interface Response {
  data: {
    data: {
      user: User;
    };
  };
}

const getUserProfile = async (
  config?: AxiosRequestConfig
): Promise<Response['data']> => {
  try {
    const res: Response = await axiosInit.get('/api/users/MyAccount', {
      ...config,
    });
    // resolve promise with user User Data and Token
    return Promise.resolve(res.data);
  } catch (e) {
    // reject promise with error
    return Promise.reject(e);
  }
};

export default getUserProfile;

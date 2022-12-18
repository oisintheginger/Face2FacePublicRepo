import { User } from '../../configs/interfaces';
import axiosInit from '../../services/axios';

interface Response {
  data: {
    token: {
      type: 'bearer';
      token: string;
    };
    user: User;
  };
}

type Credentials = {
  code: string;
  password: string;
};

const resetPasswordApi = async ({
  code,
  password,
}: Credentials): Promise<Response['data']> => {
  try {
    // Post Credentials
    const res: Response = await axiosInit.post('/api/users/resetPassword', {
      code,
      password,
    });
    // resolve promise with user User Data and Token
    return Promise.resolve(res.data);
  } catch (e) {
    // reject promise with error
    return Promise.reject(e);
  }
};

export default resetPasswordApi;

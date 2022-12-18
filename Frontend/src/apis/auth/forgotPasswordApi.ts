import axiosInit from '../../services/axios';

interface Response {
  data: {
    status: boolean;
    message: string;
  };
}

type Credentials = {
  email: string;
  appUrl: string;
};

const forgotPasswordApi = async ({
  email,
  appUrl,
}: Credentials): Promise<Response['data']> => {
  try {
    // Post Credentials
    const res: Response = await axiosInit.post('password/send-reset-code', {
      email,
      appUrl,
    });
    // resolve promise with user User Data and Token
    return Promise.resolve(res.data);
  } catch (e) {
    // reject promise with error
    return Promise.reject(e);
  }
};

export default forgotPasswordApi;

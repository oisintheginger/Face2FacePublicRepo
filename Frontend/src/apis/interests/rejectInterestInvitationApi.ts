import { AxiosRequestConfig } from 'axios';
import axiosInit from 'src/services/axios';

interface Response {
  status: string;
  data: {
    status: 'Ok';
    success: true;
    message: 'successfully sent email to interested user';
    data: {};
  };
}

const rejectInterestInvitationApi = async (
  data: {
    interestId: string;
  },
  config?: AxiosRequestConfig
): Promise<Response['data']> => {
  try {
    // Post Credentials
    const res: Response = await axiosInit.post(
      '/api/properties/rejectInterest',
      data,
      {
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

export default rejectInterestInvitationApi;

import { AxiosRequestConfig } from 'axios';
import { Interest } from 'src/configs/interfaces';
import axiosInit from 'src/services/axios';

interface Response {
  status: string;
  data: {
    interest: Interest;
  };
}

const registerInterestApi = async (
  data: {
    propertyId: string;
  },
  config?: AxiosRequestConfig
): Promise<Response['data']> => {
  try {
    // Post Credentials
    const res: Response = await axiosInit.post(
      '/api/properties/registerInterest',
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

export default registerInterestApi;

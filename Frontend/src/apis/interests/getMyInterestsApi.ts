import { AxiosRequestConfig } from 'axios';
import { Interest } from 'src/configs/interfaces';
import axiosInit from 'src/services/axios';

interface Response {
  data: {
    status: string;
    data: {
      interests: Interest[];
    };
  };
}

const getMyInterestsApi = async (
  config?: AxiosRequestConfig
): Promise<Response['data']> => {
  try {
    // Post Credentials
    const res: Response = await axiosInit.get('/api/properties/myInterests', {
      ...config,
    });
    // resolve promise with user User Data and Token
    return Promise.resolve(res.data);
  } catch (e) {
    // reject promise with error
    return Promise.reject(e);
  }
};

export default getMyInterestsApi;

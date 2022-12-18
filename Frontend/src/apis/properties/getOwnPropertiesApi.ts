import { AxiosRequestConfig } from 'axios';
import { Property } from 'src/configs/interfaces';
import axiosInit from 'src/services/axios';

interface Response {
  data: {
    data: {
      Properties: Property[];
    };
    status: string;
    results: number;
  };
}

const getOwnPropertiesApi = async (
  config?: AxiosRequestConfig
): Promise<Response['data']> => {
  try {
    // Post Credentials
    const res: Response = await axiosInit.get(
      '/api/properties/MyOwnedProperties',
      config
    );
    // resolve promise with user User Data and Token
    return Promise.resolve(res.data);
  } catch (e) {
    // reject promise with error
    return Promise.reject(e);
  }
};

export default getOwnPropertiesApi;

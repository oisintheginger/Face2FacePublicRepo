import { AxiosRequestConfig } from 'axios';
import { Property } from 'src/configs/interfaces';
import axiosInit from 'src/services/axios';

interface Response {
  data: {
    data: {
      propertyData: Property;
    };
    status: string;
  };
}

const getSinglePropertyApi = async (
  propertyId: string,
  config?: AxiosRequestConfig
): Promise<Response['data']> => {
  try {
    // Post Credentials
    const res: Response = await axiosInit.get('/api/properties/propertyByID', {
      ...config,
      params: {
        ...config?.params,
        propertyId,
      },
    });
    // resolve promise with user User Data and Token
    return Promise.resolve(res.data);
  } catch (e) {
    // reject promise with error
    return Promise.reject(e);
  }
};

export default getSinglePropertyApi;

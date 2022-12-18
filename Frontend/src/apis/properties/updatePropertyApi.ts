import { AxiosRequestConfig } from 'axios';
import { Property } from 'src/configs/interfaces';
import axiosInit from 'src/services/axios';

interface Response {
  data: {
    status: number;

    property: Property;
  };
}

const updatePropertyApi = async (
  formData: FormData,
  config?: AxiosRequestConfig
): Promise<Response['data']> => {
  try {
    // Post Credentials
    const res: Response = await axiosInit.patch(
      '/api/properties/editProperty',
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

export default updatePropertyApi;

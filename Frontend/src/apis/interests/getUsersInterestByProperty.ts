import { AxiosRequestConfig } from 'axios';
import { Interest, Property, User } from 'src/configs/interfaces';
import axiosInit from 'src/services/axios';

interface Response {
  data: {
    status: string;
    data: {
      property: Pick<Property, '_id' | 'name'>;
      interestData: {
        interest: Pick<Interest, 'id' | 'interestStatus'>;
        user: User;
      }[];
    };
  };
}

const getUsersInterestByProperty = async (
  propertyId: string,
  config?: AxiosRequestConfig
): Promise<Response['data']> => {
  try {
    // Post Credentials
    const res: Response = await axiosInit.get(
      '/api/properties/getUsersInterestedInProperty',
      {
        ...config,
        params: {
          ...config?.params,
          propertyId,
        },
      }
    );
    // resolve promise with user User Data and Token
    return Promise.resolve(res.data);
  } catch (e) {
    // reject promise with error
    return Promise.reject(e);
  }
};

export default getUsersInterestByProperty;

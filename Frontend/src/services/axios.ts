import Axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { STORAGE_KEYS } from '../configs/constants';

const axiosInit = Axios.create({ baseURL: process.env.REACT_APP_API_URL });

// Set the AUTH token for any request
axiosInit.interceptors.request.use(function (config) {
  config.headers = config.headers ?? {};
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  config.headers.Authorization = token ? `${token}` : '';
  return config;
});

// Instance response interceptor
axiosInit.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (
    error: AxiosError<{
      data: {};
      message: string;
      status: string;
      success: false;
    }>
  ) {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    // Any status codes that falls outside the range of 2xx cause this function to trigger

    // return default error if no response from server
    if (!error.response) {
      toast.error(error.message);
      return Promise.reject(error);
    }

    // construct error message based on error use case
    let errorMessage: string = error.message;

    if (/network/i.test(errorMessage)) {
      errorMessage = 'Please check your internet connection and try again.';
      toast.error(errorMessage);
      return Promise.reject(error);
    }

    // user auth error
    if (error.response.status === 401) {
      errorMessage = 'Access Denied';
      toast.error(errorMessage);
      return Promise.reject(error);
    }

    // error message from server if available
    if (error?.response?.data?.message) {
      errorMessage = error.response?.data?.message || '';
      toast.error(errorMessage);
      return Promise.reject(error);
    }

    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export default axiosInit;

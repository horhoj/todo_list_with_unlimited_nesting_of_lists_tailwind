import { AxiosError } from 'axios';
import { ApiError } from './common.types';

export const getApiErrors = (e: unknown): ApiError => {
  if (e instanceof AxiosError) {
    return {
      errorMessage: e.message,
      errorResponseMessage: e.response?.data?.message,
    };
  } else if (e instanceof Error) {
    return { errorMessage: e.message };
  }

  return { errorMessage: 'Unknown error' };
};

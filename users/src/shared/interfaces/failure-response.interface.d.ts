import { BaseResponse } from './base-response.interface';

export interface FailureResponse<T> extends BaseResponse<T> {
  success: false;
}

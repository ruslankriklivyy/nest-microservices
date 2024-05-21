import { BaseResponse } from './base-response.interface';

export interface SuccessResponse<T> extends BaseResponse<T> {
  success: true;
}

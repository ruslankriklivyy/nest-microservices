import { BaseResponse } from '../interfaces/base-response.interface';

export class BaseResponseDto<T> implements BaseResponse<T> {
  message = '';
  data = null;
  status = null;

  constructor(payload: BaseResponse<T>) {
    this.data = payload.data;
    this.status = payload.status;
    this.message = payload.message;
  }
}

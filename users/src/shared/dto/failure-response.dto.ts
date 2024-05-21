import { BaseResponseDto } from './base-response.dto';
import { FailureResponse } from '../interfaces/failure-response.interface';

export class FailureResponseDto<T> extends BaseResponseDto<T> {
  success: false;

  constructor(payload: FailureResponse<T>) {
    super(payload);
  }

  public getResponse() {
    return {
      message: this.message,
      data: this.data,
      status: this.status,
      success: this.success,
    };
  }
}

import { BaseResponseDto } from './base-response.dto';
import { SuccessResponse } from '../interfaces/success-response.interface';

export class SuccessResponseDto<T> extends BaseResponseDto<T> {
  success: true;

  constructor(payload: SuccessResponse<T>) {
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

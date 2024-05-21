import { HttpStatus } from '@nestjs/common';

export interface BaseResponse<T> {
  message: string;
  status: HttpStatus;
  data?: T;
}

export interface IErrorResponse {
  status: number;
  success: boolean;
  message: string;
  errors?: any[];
}

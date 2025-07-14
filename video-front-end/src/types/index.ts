export interface Response {
  code: number;
  message: string;
  [property: string]: unknown;
}
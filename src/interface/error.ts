// export type TErrorSources = {
//   path: string;
//   message: string;
// };

// export type TGenericErrorResponse = {
//   statusCode: number;
//   message: string;
//   errorSources: TErrorSources;
// };

// export type TErrorSources = TErrorSource[];

// export interface TErrorResponse {
//     statusCode?: number;
//     success: boolean;
//     message: string;
//     errorSources: TErrorSources[];
//     stack?: string;
//     error?: unknown;
// } 



// const errorSources: TErrorSources = [
//   {
//     path: "",
//     message: message,
//   },
// ];



export type TErrorSource = {
  path: string;
  message: string;
};

export type TErrorSources = TErrorSource[];

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
};

export interface TErrorResponse {
  statusCode?: number;
  success: boolean;
  message: string;
  errorSources: TErrorSources;
  stack?: string;
  error?: unknown;
};

// const errorSources: TErrorSources = [
//   {
//     path: "",
//     message: message,
//   },
// ];


const message = "Something went wrong";

const errorSources: TErrorSources = [
  {
    path: "",
    message,
  },
];

const errorResponse: TErrorResponse = {
  success: false,
  message,
  errorSources,
};



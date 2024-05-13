import { ApiResponse } from '../types';

export default function extractErrorMsg(data: ApiResponse) {
  let errorMsg = 'A network error was encountered';

  if (data.errors && data.errors.length) {
    errorMsg = data.errors
      ?.map((err) => {
        if (err.msg) return err.msg;
        if (err.message) return err.message;
      })
      .join(' ');
  } else if (data.message) {
    errorMsg = String(data.message);
  }

  return errorMsg;
}

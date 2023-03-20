import React from 'react';

import { toast } from 'react-toastify';
import messageStyle from '../components/toast/toastStyle';

const notifyFail = (msg) => toast.error(msg, messageStyle);

const apiHandleError = (response) => {
  let errorMessage = '';
  if (response.status === 251) errorMessage = response.data.error;
  else if (response.status === 255) errorMessage = 'Please Authenticate';
  else errorMessage = 'Unknown Error';

  return <div>{notifyFail(errorMessage)}</div>;
};

export default apiHandleError;

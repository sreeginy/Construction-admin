import { toast, ToastContainer } from 'react-toastify';
// Toast
import messageStyle from './toastStyle';

const notifySuccess = (msg) => toast.success(msg, messageStyle);
const notifyError = (msg) => toast.error(msg, messageStyle);

export default [notifyError, notifySuccess];

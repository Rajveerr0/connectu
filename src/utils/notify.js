// src/utils/notify.js
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notifyInfo = (message, opts = {}) =>
  toast.info(message, { position: 'top-right', autoClose: 3000, pauseOnHover: true, closeOnClick: true, ...opts });

export const notifySuccess = (message, opts = {}) =>
  toast.success(message, { autoClose: 2500, ...opts });

export const notifyWarning = (message, opts = {}) =>
  toast.warn(message, { autoClose: 3500, ...opts });

export const notifyError = (message, opts = {}) =>
  toast.error(message, { autoClose: 4000, ...opts });

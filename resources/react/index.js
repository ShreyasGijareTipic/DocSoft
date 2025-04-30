import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import App from './App'
import store from './store'
import { ToastProvider } from './views/notifications/toasts/ToastContext'
import ToastContainer from './views/theme/toastContainer/toastContainer'

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
 
loadRazorpayScript().then((loaded) => {
  if (!loaded) {
    console.error('Razorpay SDK failed to load.');
  }
});
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <ToastProvider>
  <ToastContainer />
  <App />
  </ToastProvider>
    
  </Provider>,
)

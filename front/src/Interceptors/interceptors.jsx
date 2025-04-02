import axios from 'axios';

import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { disconnected, refreshToken } from '../Redux/userSlice';

const MyAxios = axios.create({
  baseURL: 'http://localhost:5000/api',
});


const AxiosInstance = ({ children }) => {
  const dispatch = useDispatch();
  const [isSet, setIsSet] = useState(false);

  useEffect(() => {
    const reqInterceptor = (config) => {
      config.headers['Authorization'] =
        `Bearer ${localStorage.getItem('accessToken')}`;
      config.headers['Content-Type'] = 'application/json';
      return config;
    };

    const resInterceptor = (response) => {
      return response.data;
    };

    const errInterceptor = async (error) => {
      console.log('message: ', error.response.data.error);
      const originalRequest = error.config;
      if (error.response.status === 401) {
        if (!localStorage.getItem('refreshToken')) {
          console.log('Pas de refreshToken, déconnexion...');
          await dispatch(disconnected());
          return Promise.reject(error.response.data);
        }

        try {
          console.log('Token expiré, tentative de rafraîchissement...');
          await dispatch(refreshToken()); // Réinitialiser après succès
          if (localStorage.getItem('accessToken')) {
            console.log('accessToken rafraichi, nouvelle tentative');
            return MyAxios(originalRequest); // nouvelle tentative avec token rafraichi
          } else {
            console.log(
              'refreshToken invalide, déconnexion',
              error.response.data,
            );
            await dispatch(disconnected());
            return Promise.reject(error.response.data);
          }
        } catch (err) {
          console.error('Erreur lors du rafraîchissement du token:', err);
          await dispatch(disconnected());
          return Promise.reject(err.response.data);
        }
      }
      return Promise.reject(error.response.data);
    };

    const interceptorReq = MyAxios.interceptors.request.use(
      reqInterceptor,
      (error) => {
        console.log('interceptor req error', error);
      },
    );

    const interceptorRes = MyAxios.interceptors.response.use(
      resInterceptor,
      errInterceptor,
    );

    setIsSet(true);
    return () => {
      MyAxios.interceptors.request.eject(interceptorReq);
      MyAxios.interceptors.response.eject(interceptorRes);
    };
  }, []);

  return isSet && children;
};

export default MyAxios;
export { AxiosInstance };

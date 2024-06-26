import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {isAxiosError} from 'axios';
import Toast from 'react-native-toast-message';

export const baseURL = 'http://192.168.100.9:8000/api/';

const Api = axios.create({baseURL});

Api.interceptors.request.use(async config => {
  const ip = await AsyncStorage.getItem('ip');
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (ip) config.baseURL = 'http://'+ip+':8000/api/';
  return config;
});

Api.interceptors.response.use(undefined, error => {
  if (isAxiosError(error)) {
    error.response == undefined &&
      Toast.show({type: 'error', text1: 'Error inesperado'});
    error.response?.data.message &&
      Toast.show({type: 'error', text1: error.response?.data.message});
  }
  throw error;
});
export default Api;

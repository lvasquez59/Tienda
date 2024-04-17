import React, {createContext, useEffect, useReducer, useState} from 'react';
import {View, useColorScheme} from 'react-native';
import Toast from 'react-native-toast-message';
import {itemProduc} from '../utils/Product/CardProduct';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../utils/api/Api';

interface colores {
  backgroundColorComponents: string;
  backgroundColor: string;
  shadowColor: string;
  borderColor: string;
  plaseholderColor: string;
}
export enum type {
  'init',
  'update',
  'delete',
}

export enum temaApp {
  Sistem = 'Sistema',
  Claro = 'Claro',
  Oscuro = 'Oscuro',
}
type contexProps = {
  colores: colores;
  comision: string;
  ip: string;
  scan: boolean;
  colorScheme: temaApp;
  actions: {item?: itemProduc; type: type};
  setserver: (e: string) => void;
  setComision: (e: string) => void;
  SetTemaApp: (e: temaApp) => void;
  setActions: React.Dispatch<
    React.SetStateAction<{item?: itemProduc; type: type}>
  >;
  SetScaner: (e: boolean) => void;
};

export const contex = createContext({} as contexProps);

export default function Contex({children}: {children: React.ReactNode}) {
  const [actions, setActions] = useState({type: type.init});
  const [colores, setColores] = useState<colores>();
  const [comision, setComi] = useState<string>('0.05');
  const [ip, setIp] = useState<string>('192.168.100.9');
  const [scan, setScan] = useState<boolean>(false);
  const [colorScheme, setColorScheme] = useState<temaApp>(temaApp.Sistem);

  let isDarkMode = useColorScheme() === 'dark';
  const getColores = async () => {
    const tem = await AsyncStorage.getItem('tema');
    if (tem && tem != temaApp.Sistem) isDarkMode = tem == temaApp.Oscuro;
    setColorScheme(tem ? (tem as temaApp) : temaApp.Sistem);
    setColores({
      backgroundColorComponents: isDarkMode ? 'white' : 'black',
      backgroundColor: isDarkMode ? '#111' : 'white',
      // backgroundColor: isDarkMode ? 'rgb(20, 20, 30)' : 'rgb(230, 230, 230)',
      shadowColor: isDarkMode
        ? 'rgba(255, 255, 255, .9)'
        : 'rgba(0, 0, 0, 0.9)',
      borderColor: isDarkMode
        ? 'rgba(255, 255, 255, .3)'
        : 'rgba(0, 0, 0, 0.3)',
      plaseholderColor: isDarkMode
        ? 'rgba(255, 255, 255, .6)'
        : 'rgba(0, 0, 0, 0.6)',
    });
  };
  const getScan = async () => {
    const scan = await AsyncStorage.getItem('scan');
    const com = await AsyncStorage.getItem('comision');
    const ser = await AsyncStorage.getItem('ip');
    if (scan) setScan(scan == 'true');
    if (com) setComi(com ?? '0.05');
    if (ser) setIp(ser ?? '192.168.100.9');
  };
  useEffect(() => {
    getColores();
    getScan();
  }, []);

  if (!colores) return <></>;
  const SetTemaApp = async (e: temaApp) => {
    await AsyncStorage.setItem('tema', e);
    getColores();
  };
  const setComision = async (e: string) => {
    e = (Number(e) / 100).toString();
    await AsyncStorage.setItem('comision', e);
    setComi(e);
  };
  const setserver = async (e: string) => {
    Api.defaults.baseURL = 'http://' + e + ':8000/api/';
    await AsyncStorage.setItem('ip', e);
    setIp(e);
  };
  const SetScaner = async (e: boolean) => {
    setScan(e);
    await AsyncStorage.setItem('scan', e + '');
  };
  return (
    <contex.Provider
      value={{
        comision,
        ip,
        setserver,
        setComision,
        colores: colores,
        actions,
        setActions,
        SetTemaApp,
        colorScheme,
        scan,
        SetScaner,
      }}>
      <View style={{zIndex: 9999}}>
        <Toast />
      </View>
      {children}
    </contex.Provider>
  );
}

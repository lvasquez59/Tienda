import React, {useContext, useEffect, useState} from 'react';
import {View} from './View';
import {Text} from './Text';
import {contex} from '../context/Contex';

export const Reloj = () => {
  const date = new Date();

  const {colores} = useContext(contex);
  const MESES = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  const [dataTime, setDataTime] = useState(date);

  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      setDataTime(date);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View
      style={{
        // display: 'flex',
        width: '100%',
        padding: 7,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: colores.backgroundColorComponents,
        borderRadius: 10,
        flexDirection: 'row',
      }}>
      <Text toggled>
        {dataTime.toLocaleDateString('en-mx', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );
};

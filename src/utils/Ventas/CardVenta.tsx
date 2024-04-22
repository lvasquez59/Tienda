import React, {useContext, useState} from 'react';
import CardProduct, {itemProduc} from '../Product/CardProduct';
import {contex} from '../../context/Contex';
import {View} from '../../components/View';
import {Text} from '../../components/Text';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button} from '../../components/Button';
import {FlatList} from 'react-native';

export interface Venta {
  created_at: string;
  id_venta: number;
  total_producto: number;
  total_venta: number;
  updated_at: string;
  detalles: Detalles[];
}
export interface Detalles {
  cantidad: number;
  id_producto: number;
  id_venta: number;
  producto: itemProduc;
  total: number;
}
export default function CardVenta({item}: {item: Venta}) {
  const {colores} = useContext(contex);
  let [show, setShow] = useState(false);

  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderColor: colores.backgroundColorComponents,
        borderRadius: 10,
        marginTop: 10,
        paddingHorizontal: 20,
        flex: 1,
        width: '90%',
        alignSelf: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}>
      <View>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
          }}>
          Total de la venta : ${item.total_venta}
        </Text>
        <Text
          style={{
            fontSize: 20,
          }}>
          Total de productos : {item.total_producto}
        </Text>
      </View>
      <View>
        <Text
          style={{
            fontSize: 20,
          }}>
          Fecha : {item.created_at.split('T')[0]}
        </Text>
        <Text
          style={{
            fontSize: 20,
          }}>
          Hora : {item.created_at.split('T')[1].split('.')[0]}
        </Text>
      </View>
      <AntDesign
        name="down"
        size={30}
        onPress={() => setShow(!show)}
        color={colores.backgroundColorComponents}
      />
      {show && (
        <FlatList
          data={item.detalles}
          scrollToOverflowEnabled={true}
          showsVerticalScrollIndicator={false}
          style={{width: '100%', padding: 20, paddingTop: 5}}
          renderItem={({item}) => (
            <CardProduct
              item={item.producto}
              onPress={() => {}}
              detalle={item}
            />
          )}
        />
      )}
    </View>
  );
}

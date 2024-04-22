import React, {useContext, useEffect, useRef, useState} from 'react';
import {View} from '../components/View';
import {Text} from '../components/Text';
import {FlatList} from 'react-native';
import CardProduct, {itemProduc} from '../utils/Product/CardProduct';
import {contex, type} from '../context/Contex';
import Api from '../utils/api/Api';
import {StackScreenProps} from '@react-navigation/stack';
import {Product, ProductComponentMethods} from '../utils/Product/Product';

export default function Pesado(props: StackScreenProps<any, 'Pesado'>) {
  const {actions, colores} = useContext(contex);

  const product = useRef<ProductComponentMethods | null>(null);
  const [data, setData] = useState<itemProduc[]>([]);
  useEffect(
    () =>
      props.navigation.addListener('focus', () => {
        Api.get('producto/pesado').then(response => setData(response.data));
      }),
    [props.navigation],
  );

  useEffect(() => {
    switch (actions.type) {
      case type.update:
        setData(data => {
          return data.map(i => {
            if (i.codigo == actions.item!.codigo)
              return {...actions.item!, unidad: i.unidad};
            else return i;
          });
        });
        break;
      case type.delete:
        setData(data => {
          return data.filter(i => i.codigo != actions.item!.codigo);
        });
        break;
      case type.init:
      default:
        return;
    }
  }, [actions.type, actions.item]);

  return (
    <View.Bbg>
      <Product ref={product} />
      <View
        style={{
          marginHorizontal: 5,
          width: '99%',
          height: '97%',
          borderWidth: 1,
          borderColor: colores.backgroundColorComponents,
          borderRadius: 20,
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            marginLeft: 15,
            fontSize: 20,
            textAlign: 'center',
          }}>
          Productos Pesados
        </Text>
        <FlatList
          data={data}
          scrollToOverflowEnabled={true}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <CardProduct
              item={item}
              onPress={item => product.current?.show({i: item})}
              onPressAdd={item =>
                props.navigation.navigate('Home', {item: {...item, unidad: 1}})
              }
            />
          )}
        />
      </View>
    </View.Bbg>
  );
}

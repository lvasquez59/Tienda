import {FlatList, ScrollView} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {View} from '../components/View';
import CardProduct, {itemProduc} from '../utils/Product/CardProduct';
import {Text} from '../components/Text';
import {TextInput} from '../components/Input';
import Api from '../utils/api/Api';
import {Button} from '../components/Button';
import Toast from 'react-native-toast-message';
import {Product, ProductComponentMethods} from '../utils/Product/Product';
import {contex, type} from '../context/Contex';
import {TextInput as TexRef} from 'react-native';
import KeyEvent, {KeyEventProps} from 'react-native-keyevent';
import {Keyboard} from 'react-native';
import {Checkbox} from '../components/Checkbox';
import {useWindowDimensions} from 'react-native';
import {Reloj} from '../components/Reloj';

export default function Home(
  props: StackScreenProps<{Home?: {item?: itemProduc}}, 'Home'>,
) {
  const {actions, scan, colores, comision} = useContext(contex);
  const [data, setData] = useState<itemProduc[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pago, setPago] = useState<number>(0);
  const [items, setItems] = useState<number>(0);
  const product = useRef<ProductComponentMethods | null>(null);
  const inputRef2 = useRef<TexRef>(null);

  const layout = useWindowDimensions().width > useWindowDimensions().height;
  const timerRef = useRef<any>(null);

  let pressedKey = '';
  useEffect(() => {
    KeyEvent.onKeyDownListener((keyEvent: KeyEventProps) => {
      if (!Keyboard.isVisible()) {
        pressedKey = pressedKey + keyEvent.pressedKey;
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          !props.navigation.isFocused() && props.navigation.navigate('Home');
          pressedKey.length > 1 && buscar(pressedKey);
          pressedKey = '';
        }, 50);
      }
    });
  }, []);

  useEffect(() => {
    setItems(data.reduce((a, c) => a + (c.unidad ?? 1), 0));
    setTotal(data.reduce((a, c) => a + (c.total ?? 0), 0));
  }, [data]);

  useEffect(
    () =>
      setData(data => {
        const {item} = props.route.params ?? {};
        if (!item) return data;
        const updatedData = data.map(i => {
          if (i.codigo == props.route.params?.item?.codigo)
            return {...i, unidad: (i.unidad ?? 1) + 1};
          else return i;
        });
        if (!updatedData.some(i => i.codigo === item.codigo))
          updatedData.push(item);
        return updatedData;
      }),
    [props.route.params],
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

  const buscar = async (e: string) => {
    if (e != '')
      Api.get('producto/' + e)
        .then(response =>
          setData(data => {
            let item = response.data;
            const updatedData = data.map(i => {
              if (i.codigo == item?.codigo)
                return {...i, unidad: (i.unidad ?? 1) + 1};
              else return i;
            });
            if (!updatedData.some(i => i.codigo === item.codigo))
              updatedData.push(item);
            return updatedData;
          }),
        )
        .catch(err => {
          product.current?.show({codigo: e});
        });
    else {
      setTotal(0);
      setData([]);
    }
  };

  const ventas = () => {
    console.log(data);

    Api.post('ventas/', {
      total_venta: total,
      total_producto: data.reduce((a, c) => a + (c.unidad ?? 1), 0),
      productos: data,
    }).then(response => {
      Toast.show({
        text1: 'Venta registrada',
        type: 'success',
      });
      setTotal(0);
      setData([]);
    });
  };

  return (
    <>
      <View style={{zIndex: 9999}}>
        <Toast />
      </View>
      <View.Bbg
        style={{
          alignItems: layout ? 'center' : 'baseline',
          flexDirection: layout ? 'row' : 'column',
        }}>
        <Product ref={product} />
        <View
          style={{
            marginHorizontal: layout ? 5 : 0,
            width: layout ? '73%' : '100%',
            height: layout ? '97%' : '70%',
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
            Productos
          </Text>
          <FlatList
            data={data}
            scrollToOverflowEnabled={true}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <CardProduct
                item={item}
                onPress={item => {
                  let newdata = data.filter(i => i.codigo != item.codigo);
                  setItems(newdata.reduce((a, c) => a + (c.unidad ?? 0), 0));
                  setData(newdata);
                }}
                onChangeTotal={() => {
                  setItems(data.reduce((a, c) => a + (c.unidad ?? 1), 0));
                  setTotal(data.reduce((a, c) => a + (c.total ?? 0), 0));
                }}
              />
            )}
          />
        </View>
        <View
          style={{
            width: layout ? '25%' : '100%',
            height: layout ? '97%' : '30%',
            alignItems: 'center',
          }}>
          {scan ? (
            <TextInput
              scanned
              ref={inputRef2}
              placeholder="codigo"
              onSubmitEditing={e => {
                buscar(e.nativeEvent.text);
                'clear' in e.currentTarget &&
                  typeof e.currentTarget.clear == 'function' &&
                  e.currentTarget.clear();
              }}
              onScanned={buscar}
              blurOnSubmit={false}
              containerInputStyle={{width: '100%'}}
            />
          ) : (
            <Reloj />
          )}
          <View
            style={{
              margin: 5,
              width: '100%',
              flex: 1,
              borderWidth: 1,
              borderColor: colores.backgroundColorComponents,
              borderRadius: 20,
              // alignItems: 'center',
              // flexDirection: 'row',
              paddingBottom: 10,
              // width: '100%',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                marginLeft: 15,
                fontSize: 20,
                textAlign: 'center',
              }}>
              Detalles
            </Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View>
                <View
                  style={{
                    justifyContent: 'space-between',
                    width: layout ? '88%' : '100%',
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                    }}>
                    Tipo de pago:{' '}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: layout ? '100%' : '88%',
                    }}>
                    <Checkbox
                      text="Efectivo"
                      value={pago == 0}
                      onChangeValue={() => setPago(0)}></Checkbox>
                    <Checkbox
                      text="Tarjeta"
                      value={pago == 1}
                      onChangeValue={() => setPago(1)}></Checkbox>
                  </View>
                </View>

                <View
                  style={{
                    justifyContent: 'space-between',
                    width: '88%',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                    }}>
                    Productos:{' '}
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}>
                    {items}
                  </Text>
                </View>
                {pago == 1 && (
                  <View
                    style={{
                      justifyContent: 'space-between',
                      width: '88%',
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                      }}>
                      Comision:{' '}
                    </Text>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 20,
                      }}>
                      ${(total * Number(comision)).toFixed(1)}
                    </Text>
                  </View>
                )}

                <View
                  style={{
                    justifyContent: 'space-between',
                    width: '88%',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                    }}>
                    Total:{' '}
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}>
                    $
                    {(
                      total + (pago == 1 ? total * Number(comision) : 0)
                    ).toFixed(1)}
                  </Text>
                </View>
              </View>
            </ScrollView>
            <Button
              text="Cobrar"
              style={{width: '90%', alignSelf: 'center'}}
              onPress={ventas}
            />
          </View>
        </View>
      </View.Bbg>
    </>
  );
}

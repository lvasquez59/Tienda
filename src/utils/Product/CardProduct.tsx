import {useContext, useEffect, useState} from 'react';
import {TextInput} from '../../components/Input';
import {Text} from '../../components/Text';
import {View} from '../../components/View';
import {contex} from '../../context/Contex';
import AntDesign from 'react-native-vector-icons/AntDesign';

export interface itemProduc {
  id_producto?: string;
  codigo: string;
  producto: string;
  costo: string;
  cantidad: string;
  marca: string | null;
  unidad?: number;
  total?: number;
}

export default function CardProduct({
  item,
  onChangeTotal,
  onPress,
  onPressAdd,
}: {
  item: itemProduc;
  onChangeTotal?: () => void;
  onPress: (item: itemProduc) => void;
  onPressAdd?: (item: itemProduc) => void;
}) {
  const {colores} = useContext(contex);
  useEffect(() => {
    item.total = Number(item.costo);
  }, []);
  return (
    <View
      style={{
        // borderWidth: 1,
        borderBottomWidth: 1,
        borderColor: colores.backgroundColorComponents,
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        paddingHorizontal: 20,
        width: '100%',
        height: 100,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          width: '30%',
          // justifyContent: 'center',
        }}>
        <View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
            }}
            selectable>
            {item.producto}
          </Text>
          <Text style={{fontSize: 15}} selectable>
            {item.codigo}
          </Text>
        </View>

        {item.marca && (
          <Text style={{fontSize: 15}} selectable>
            {item.marca}
          </Text>
        )}
      </View>
      {onChangeTotal ? (
        <TextInput
          editable={false}
          isRequired
          enteros
          name="cantidad"
          placeholder="1"
          onChangeText={e => {
            item.total = Number(e) * Number(item.costo);
            item.unidad = Number(e);
            onChangeTotal();
          }}
          value={(item.unidad || 1).toString()}
          containerInputStyle={{flex: 1 / 3}}
        />
      ) : (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              textAlignVertical: 'center',
              fontWeight: 'bold',
              fontSize: 20,
            }}>
            Costo: ${item.total ?? item.costo}
          </Text>
          {/* <Text>
            Cantidad: <Text>{item.cantidad}</Text>
          </Text> */}
        </View>
      )}

      <View
        style={{
          justifyContent: 'space-around',
        }}>
        {onChangeTotal ? (
          <Text
            style={{
              textAlignVertical: 'center',
              fontWeight: 'bold',
              fontSize: 20,
            }}>
            ${item.total ?? item.costo}
          </Text>
        ) : (
          <AntDesign
            name={'plus'}
            size={30}
            color={colores.backgroundColorComponents}
            onPress={() => {
              onPressAdd && onPressAdd(item);
            }}
          />
        )}
        <AntDesign
          name={onChangeTotal ? 'close' : 'form'}
          size={30}
          color={colores.backgroundColorComponents}
          onPress={() => {
            item.total = 0;
            onPress(item);
            // onChangeTotal && onChangeTotal();
          }}
        />
      </View>
    </View>
  );
}

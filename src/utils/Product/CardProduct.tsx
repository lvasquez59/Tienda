import {useContext, useEffect, useState} from 'react';
import {TextInput} from '../../components/Input';
import {Text} from '../../components/Text';
import {View} from '../../components/View';
import {contex} from '../../context/Contex';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Detalles} from '../Ventas/CardVenta';

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
  detalle,
  onChangeTotal,
  onPress,
  onPressAdd,
}: {
  item: itemProduc;
  detalle?: Detalles;
  onChangeTotal?: () => void;
  onPress: (item: itemProduc) => void;
  onPressAdd?: (item: itemProduc) => void;
}) {
  const {colores} = useContext(contex);
  const [pesado, setPesado] = useState<number>(
    item.codigo.match('^[0-9]') ? 1 : 1000,
  );
  useEffect(() => {
    item.unidad = item.unidad ?? 1;
    if (item.codigo.match('^[0-9]'))
      item.total = Number(item.costo) * Number(item.unidad ?? 1);
    else item.total = (pesado * Number(item.costo)) / 1000;
  }, []);

  useEffect(() => {
    if (item.codigo.match('^[0-9]'))
      item.total = Number(item.costo) * Number(item.unidad ?? 1);
    else item.total = (pesado * Number(item.costo)) / 1000;
    onChangeTotal && onChangeTotal();
  }, [item.unidad, item.costo]);

  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderColor: colores.backgroundColorComponents,
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        paddingHorizontal: 20,
        width: '100%',
        height: 105,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          width: '35%',
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
            {item.codigo.match('^[0-9]') ? item.codigo : 'Pesado'}
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
          editable={item.codigo.match('^[0-9]') ? false : true}
          isRequired
          enteros
          name="cantidad"
          placeholder="1"
          onChangeText={e => {
            if (item.codigo.match('^[0-9]')) {
              item.unidad = Number(e);
              item.total = Number(item.costo) * Number(item.unidad ?? 1);
            } else {
              setPesado(Number(e));
              item.unidad = 1;
              item.total = (Number(e) * Number(item.costo)) / 1000;
            }

            onChangeTotal && onChangeTotal();
          }}
          value={pesado.toString()}
          containerInputStyle={{flex: 1 / 2.5}}
        />
      ) : (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}>
          <Text
            style={{
              textAlignVertical: 'center',
              fontWeight: 'bold',
              fontSize: 20,
            }}>
            Costo: ${item.costo}
          </Text>
          {/* <Text>
            Cantidad: <Text>{item.cantidad}</Text>
          </Text> */}
        </View>
      )}

      {!detalle ? (
        <View
          style={{
            justifyContent: 'space-around',
          }}>
          {onChangeTotal ? (
            <>
              <Text
                style={{
                  textAlignVertical: 'center',
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center',
                }}>
                ${item.total ?? item.costo}
              </Text>
              <Text style={{textAlign: 'center', fontSize: 15}}>
                ${item.costo}
              </Text>
            </>
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
            }}
          />
        </View>
      ) : (
        <Text
          style={{
            textAlignVertical: 'center',
            fontWeight: 'bold',
            fontSize: 20,
          }}>
          Cantidad: {detalle.cantidad}
        </Text>
      )}
      {detalle && (
        <Text
          style={{
            textAlignVertical: 'center',
            fontWeight: 'bold',
            fontSize: 20,
          }}>
          total: ${detalle.total}
        </Text>
      )}
    </View>
  );
}

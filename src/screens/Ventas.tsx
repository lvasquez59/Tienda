import React, {useContext, useEffect, useRef, useState} from 'react';
import {View} from '../components/View';
import {Text} from '../components/Text';
import {FlatList} from 'react-native';
import CardProduct, {itemProduc} from '../utils/Product/CardProduct';
import {contex} from '../context/Contex';
import Api from '../utils/api/Api';
import {StackScreenProps} from '@react-navigation/stack';
import {Product, ProductComponentMethods} from '../utils/Product/Product';
import CardVenta, {Venta} from '../utils/Ventas/CardVenta';
import {TextInput} from '../components/Input';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {Button} from '../components/Button';

export default function Ventas(props: StackScreenProps<any, 'Ventas'>) {
  const {colores} = useContext(contex);

  let [data, setData] = useState<Venta[]>([]);

  let [show, setShow] = useState(false);
  let [show1, setShow1] = useState(false);
  let [limit, setLimit] = useState(1);
  let [page, setPage] = useState(1);
  const [fech, setFech] = useState({fInicial: new Date(), fFinal: new Date()});
  const [total, setTotal] = useState(0);
  const [venta, setVenta] = useState(0);

  const buscar = (e: {fInicial: Date; fFinal: Date}) => {
    if (page <= limit)
      Api.get('ventas?page=' + page, {params: e})
        .then(response => {
          setTotal(response.data.total);
          setVenta(response.data.Data.total);
          setData([...data, ...response.data.Data.data]);
          setLimit(response.data.Data.last_page);
          setPage(page + 1);
        })
        .catch(e => console.error(e));
  };

  return (
    <View.Bbg>
      <View
        style={{
          marginHorizontal: 5,
          width: '99%',
          height: '97%',
          borderWidth: 1,
          borderColor: colores.backgroundColorComponents,
          borderRadius: 20,
          padding: 10,
          paddingTop: 0,
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            marginLeft: 15,
            fontSize: 20,
            textAlign: 'center',
          }}>
          Ventas Registradas
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <Text
            style={{
              //   fontWeight: 'bold',
              marginLeft: 15,
              fontSize: 20,
              textAlign: 'center',
              textAlignVertical: 'center',
            }}>
            Buscar:
          </Text>
          <Button
            onPress={() => setShow(true)}
            style={{height: 50}}
            text={
              fech.fInicial.toLocaleDateString('en-mx', {
                hour: '2-digit',
                minute: '2-digit',
              }) +
              ' -- ' +
              fech.fFinal.toLocaleTimeString('en-mx', {
                hour: '2-digit',
                minute: '2-digit',
              })
            }
          />

          <DateTimePicker
            onConfirm={e => {
              setFech({...fech, fInicial: e});
              setShow(false);
              setShow1(true);
            }}
            onCancel={() => setShow(false)}
            mode="datetime"
            isVisible={show}
          />
          <DateTimePicker
            onConfirm={e => {
              setFech({...fech, fFinal: e});
              console.log(e);
              page = 1;
              limit = 1;
              data = [];
              setShow1(false);
              buscar({...fech, fFinal: e});
            }}
            minimumDate={fech.fInicial}
            onCancel={() => setShow1(false)}
            mode="time"
            isVisible={show1}
            maximumDate={new Date()}
          />
        </View>
        <FlatList
          data={data}
          scrollToOverflowEnabled={true}
          onEndReached={() => buscar(fech)}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => <CardVenta item={item} />}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <Text
            style={{
              //   fontWeight: 'bold',
              fontSize: 25,
            }}>
            Total de ventas: {venta}
          </Text>
          <Text
            style={{
              fontSize: 25,
            }}>
            Total vendido: ${total}
          </Text>
        </View>
      </View>
    </View.Bbg>
  );
}

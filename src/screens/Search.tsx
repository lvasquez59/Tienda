import React, {useContext, useEffect, useRef, useState} from 'react';
import {View} from '../components/View';
import {Text} from '../components/Text';
import {TextInput} from '../components/Input';
import {FlatList} from 'react-native';
import CardProduct, {itemProduc} from '../utils/Product/CardProduct';
import Api from '../utils/api/Api';
import {Checkbox} from '../components/Checkbox';
import {Modal} from '../components/Modal';
import {Button} from '../components/Button';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {StackScreenProps} from '@react-navigation/stack';
import {Product, ProductComponentMethods} from '../utils/Product/Product';
import {contex, type} from '../context/Contex';
import Toast from 'react-native-toast-message';

export default function Search(props: StackScreenProps<any, 'Search'>) {
  let [data, setData] = useState<itemProduc[]>([]);
  const {actions, colores} = useContext(contex);
  let [limit, setLimit] = useState(1);
  let [page, setPage] = useState(1);
  const product = useRef<ProductComponentMethods | null>(null);
  let [show, setShow] = useState(false);
  const [filter, setFilter] = useState<{[key: string]: string}>({});
  const timerRef = useRef<any>(null);

  const filtrar = () => {
    data = [];
    setData(data);
    limit = 1;
    page = 1;
    buscar();
  };
  const buscar = () => {
    setShow(false);
    if (page <= limit)
      Api.get('producto?page=' + page, {params: filter})
        .then(response => {
          setData([...data, ...response.data.data]);
          setLimit(response.data.last_page);
          setPage(page + 1);
        })
        .catch(e => console.log(e.message));
  };

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
    <View.Bbg
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{zIndex: 9999}}>
        <Toast />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}>
        <Product ref={product} />
        <TextInput
          scanned
          placeholder="Producto"
          value={filter['producto']}
          onChangeText={value => {
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
              filtrar();
            }, 400);
            filter['producto'] = value;
          }}
          // onSubmitEditing={e => {
          //   filtrar();
          //   // 'clear' in e.currentTarget &&
          //   //   typeof e.currentTarget.clear == 'function' &&
          //   //   e.currentTarget.clear();
          // }}
          onScanned={filtrar}
          containerInputStyle={{marginRight: 10}}
          blurOnSubmit={false}
        />
        <Modal.Button
          propsView={{style: {padding: 10}}}
          visible={show}
          propsButton={{
            children: (
              <AntDesign
                name="filter"
                color={colores.backgroundColor}
                size={25}
              />
            ),
            style: {width: undefined},
            onPress: () => setShow(true),
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 10,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 25,
                paddingHorizontal: 15,
              }}>
              Filtrar
            </Text>
            <AntDesign
              name={'close'}
              color={colores.backgroundColorComponents}
              size={30}
              onPress={() => setShow(!show)}
            />
          </View>
          {['marca'].map(item => (
            <Filtro key={item} name={item} filter={filter} />
          ))}
          <Button
            text="Buscar"
            style={{width: undefined, marginVertical: 10, alignSelf: 'center'}}
            onPress={filtrar}
          />
        </Modal.Button>
      </View>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <CardProduct
            item={item}
            onPress={item => product.current?.show({i: item})}
            onPressAdd={item => {
              props.navigation.navigate('Home', {item: item});
            }}
          />
        )}
        style={{
          marginBottom: 5,
          width: '100%',
        }}
        onEndReached={buscar}
        contentContainerStyle={{
          alignItems: 'center',
        }}
      />
    </View.Bbg>
  );
}

function Filtro({
  name,
  filter,
}: {
  name: string;
  filter: {[key: string]: string};
}) {
  const [enable, setEnable] = useState(filter[name] ? true : false);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <Checkbox
        text={name}
        value={enable}
        onChangeValue={e => {
          if (e) filter[name] = '';
          else delete filter[name];
          setEnable(e);
        }}
      />
      <TextInput
        // scanned
        editable={enable}
        value={filter[name] ?? ''}
        containerInputStyle={{width: '70%'}}
        placeholder={name}
        onChangeText={(value: string) => {
          if (enable) {
            filter[name] = value;
          }
        }}
        blurOnSubmit={false}
      />
    </View>
  );
}

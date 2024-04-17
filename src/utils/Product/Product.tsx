import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {View} from '../../components/View';
import {Text} from '../../components/Text';
import {itemProduc} from './CardProduct';
import {Modal} from '../../components/Modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TextInput} from '../../components/Input';
import {Form, FormSubmit, validateFormData} from '../../components/Form';
import Api from '../api/Api';
import {ScrollView} from 'react-native';
import Toast from 'react-native-toast-message';
import {Button} from '../../components/Button';
import {contex, type} from '../../context/Contex';

export interface ProductComponentMethods {
  show: (params: {codigo?: String; i?: itemProduc}) => void;
  dimis: () => void;
}
export const Product = forwardRef<ProductComponentMethods>(function (
  props,
  ref,
) {
  const {setActions, colores} = useContext(contex);
  const [visible, setVisible] = useState(false);
  let [save, setSave] = useState(false);
  const [item, setItem] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  // useEffect(() => setVisible(true), [item]);

  const show = (params: {codigo?: String; i?: itemProduc}) => {
    setSave(params.i ? true : false);
    setErrors({});
    setItem({
      ...(params.i ?? {}),
      codigo: params.codigo ?? params.i?.codigo.toString(),
    });
    setVisible(true);
  };
  const dimis = () => setVisible(false);
  const delet = () => {
    Api.delete('producto/' + item.id_producto).then(response => {
      Toast.show({text1: 'Eliminado correctamente'});
      dimis();
    });
    setActions({type: type.delete, item: item});
  };

  const submit = () => {
    const err = validateFormData(item, ['codigo', 'producto', 'costo']);
    setErrors(err);
    if (Object.keys(err).length != 0) {
      return;
    }
    if (save)
      Api.patch('producto/' + item.id_producto, item)
        .then(response => {
          Toast.show({text1: 'Actualizado correctamente'});
          setActions({type: type.update, item: {...item, ...item}});
          dimis();
        })
        .catch(err => console.log(err));
    else
      Api.post('producto/', item).then(response => {
        Toast.show({text1: 'Guardado correctamente'});
        dimis();
      });
  };

  useImperativeHandle(ref, () => ({show, dimis}));

  return (
    <Modal
      propsView={{style: {padding: 10, width: '75%'}}}
      visible={visible}
      animationType="none">
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
          {save ? 'Actualizar' : 'Guardar'}
        </Text>
        <AntDesign
          name={'close'}
          size={30}
          color={colores.backgroundColorComponents}
          onPress={() => setVisible(!visible)}
        />
      </View>
      <ScrollView contentContainerStyle={{alignItems: 'center'}}>
        <TextInput
          isRequired
          editable={false}
          name="codigo"
          placeholder="Codigo"
          label="Codigo"
          value={item.codigo}
          onChangeText={e => setItem({...item, codigo: e})}
          errors={errors}
        />
        <TextInput
          isRequired
          name="producto"
          placeholder="Producto"
          label="Producto"
          value={item.producto}
          onChangeText={e => setItem({...item, producto: e})}
          errors={errors}
        />
        <TextInput
          isRequired
          enteros
          label="Costo"
          name="costo"
          placeholder="0"
          value={item.costo}
          onChangeText={e => setItem({...item, costo: e})}
          errors={errors}
        />
        <TextInput
          enteros
          name="cantidad"
          label="Cantidad"
          placeholder="0"
          value={item.cantidad}
          onChangeText={e => setItem({...item, cantidad: e})}
          errors={errors}
        />
        <TextInput
          name="marca"
          label="Marca"
          placeholder="Marca"
          value={item.marca}
          onChangeText={e => setItem({...item, marca: e})}
          errors={errors}
        />
        {save ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '80%',
            }}>
            <Button
              text="Eliminar"
              style={{
                width: '45%',
                justifyContent: 'center',
                flexDirection: 'row-reverse',
              }}
              onPress={delet}>
              <AntDesign
                name="exclamationcircleo"
                color={'red'}
                style={{marginRight: 5}}
              />
            </Button>
            <Button
              style={{width: '45%'}}
              text={save ? 'Actualizar' : 'Guardar'}
              onPress={submit}
            />
          </View>
        ) : (
          <Button
            style={{width: '45%'}}
            text={save ? 'Actualizar' : 'Guardar'}
            onPress={submit}
          />
        )}
      </ScrollView>
    </Modal>
  );
});

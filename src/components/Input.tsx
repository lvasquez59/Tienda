import {
  View,
  TextInput as TextImput,
  ViewStyle,
  TextInputProps,
  StyleProp,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
} from 'react-native';
import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {Text} from './Text';
import {ErrorMessage} from './ErrorMessage';
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import {styles} from '../Theme/Styles';
import {contex} from '../context/Contex';
import {Button} from './Button';
import {RNCamera} from 'react-native-camera';

/**
 * Interfaz que define las propiedades para el componente TextImput.
 */
interface InputTypes extends TextInputProps {
  /**
   * Nombre del input type.
   */
  name?: string;

  /**
   * Encabezado del input type.
   */
  label?: string;

  /**
   * Indica si el input es de tipo contraseña.
   */
  isPassword?: boolean;

  /**
   * Indica si el input es obligatorio.
   */
  isRequired?: boolean;

  /**
   * Estilo adicional para el contenedor del input.
   */
  containerInputStyle?: StyleProp<ViewStyle>;

  /**
   * Mensajes de error asociados al input.
   */
  errors?: string | any;

  /**
   * Indica si solo se aceptan números enteros.
   */
  enteros?: boolean;

  /**
   * Indica si se necesita abrir la camara.
   */
  scanned?: boolean;

  /**
   * Indica si se necesita abrir la camara.
   */
  onScanned?: (e: string) => void;

  /**
   * Indica si se aceptan números decimales.
   */
  decimal?: boolean;

  /**
   * Elemento adicional a la derecha del input.
   */
  InputRightElement?: JSX.Element;
}

/**
 * Componente funcional que representa un TextImput.
 */
export const TextInput = forwardRef(function (
  props: InputTypes,
  ref: React.LegacyRef<TextImput>,
) {
  const {
    containerInputStyle,
    label,
    isRequired,
    enteros = false,
    decimal = false,
    isPassword,
    name,
    onChangeText,
    style,
    onBlur,
    errors = {},
    onFocus,
    InputRightElement,
    scanned = false,
    onScanned,
  } = props;

  const [show, setShow] = useState(isPassword);

  const [scanner, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);

  const layout = useWindowDimensions();

  const [focus, setFocus] = useState(false);
  const refA = React.createRef<Animatable.View>();
  const {colores, scan} = useContext(contex);
  const [value, setValue] = useState(props.value ?? '');

  const handleShowPassword = useCallback(() => {
    setShow(!show);
  }, [show]);

  useEffect(() => {
    if (errors[`${name}`]) refA.current?.shake && refA.current?.shake(800);
  }, [errors]);

  useEffect(() => setValue(props.value ?? ''), [props.value]);

  return (
    <Animatable.View
      ref={refA}
      style={[
        {
          marginVertical: 4,
          width: '90%',
          maxWidth: 400,
          display: 'flex',
        },
        containerInputStyle,
      ]}>
      {label && (
        <Text style={{marginVertical: 2}}>
          {label}
          {isRequired && <Text> *</Text>}
        </Text>
      )}
      <View>
        <TextImput
          keyboardType={enteros || decimal ? 'number-pad' : props.keyboardType}
          {...props}
          ref={ref}
          value={value}
          onChangeText={e => {
            if (enteros || decimal) {
              if (e.match(enteros ? /^\d*?$/ : /^\d*(\.\d*)?$/) !== null) {
                onChangeText && onChangeText(e);
                setValue(e);
              }
            } else {
              onChangeText && onChangeText(e);
              setValue(e);
            }
          }}
          secureTextEntry={show}
          onBlur={e => {
            setFocus(false);
            onBlur && onBlur(e);
          }}
          onFocus={e => {
            setFocus(true);
            onFocus && onFocus(e);
          }}
          placeholderTextColor={colores.plaseholderColor}
          style={[
            styles().Input(focus),
            {textAlign: enteros ? 'center' : undefined},
            style,
          ]}
          autoCapitalize={
            props.keyboardType == 'email-address' || isPassword
              ? 'none'
              : props.autoCapitalize
          }
        />
        {scanned && scan && (
          <>
            <Button
              text="Scanner"
              style={{
                position: 'absolute',
                marginTop: 0.6,
                height: '96%',
                right: 1,
                width: '35%',
                justifyContent: 'center',
                padding: 0,
                borderRadius: 0,
                borderBottomLeftRadius: 50,
                borderTopLeftRadius: 50,
              }}
              onPress={() => setScanned(!scanner)}
            />

            <Modal animationType="slide" transparent={true} visible={scanner}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                }}>
                <Button
                  onPress={() => setScanned(false)}
                  style={{
                    position: 'absolute',
                    right: 20,
                    top: 30,
                    width: 60,
                    padding: 10,
                  }}
                  text="close"
                />
                <RNCamera
                  flashMode={torch ? 'torch' : 'off'}
                  type="back"
                  style={{width: layout.width, height: layout.height}}
                  onBarCodeRead={e => {
                    setTorch(false);
                    onScanned && onScanned(e.data);
                    setScanned(false);
                  }}
                />

                <Button
                  onPress={() => setTorch(!torch)}
                  style={{
                    position: 'absolute',
                    bottom: 30,
                    width: 60,
                    borderRadius: 100,
                    padding: 20,
                  }}
                  text="flash"
                />
              </View>
            </Modal>
          </>
        )}
        {enteros && (
          <>
            <Feather
              onPress={() => {
                setValue((Number(value) + 1).toString());

                onChangeText && onChangeText((Number(value) + 1).toString());
              }}
              style={{
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                right: 5,
                width: '25%',
                height: '100%',
                position: 'absolute',
                textAlignVertical: 'center',
              }}
              name={'chevron-up'}
              size={24}
              color={colores.backgroundColorComponents}
            />

            <Feather
              onPress={() => {
                setValue(
                  (Number(value) > 0 ? Number(value) - 1 : 0).toString(),
                );
                onChangeText &&
                  onChangeText(
                    (Number(value) > 0 ? Number(value) - 1 : 0).toString(),
                  );
              }}
              style={{
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                left: 5,
                width: '25%',
                height: '100%',
                position: 'absolute',
                textAlignVertical: 'center',
              }}
              name={'chevron-down'}
              size={24}
              color={colores.backgroundColorComponents}
            />
          </>
        )}
        {isPassword && (
          <TouchableOpacity
            style={{
              height: '100%',
              right: 1,
              width: '15%',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
            }}
            onPress={handleShowPassword}>
            <Feather
              name={show ? 'eye-off' : 'eye'}
              size={24}
              color={colores.backgroundColorComponents}
            />
          </TouchableOpacity>
        )}
        {InputRightElement && (
          <View
            style={{
              height: '100%',
              right: 1,
              paddingHorizontal: 10,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
            }}>
            {InputRightElement}
          </View>
        )}
      </View>
      {name && ErrorMessage(errors, name, label ?? props.placeholder)}
    </Animatable.View>
  );
});

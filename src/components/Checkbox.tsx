import {FC, useContext, useEffect, useState} from 'react';
import {
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {Text} from './Text';
import {styles} from '../Theme/Styles';
import {contex} from '../context/Contex';

export interface CheckboxProps extends TouchableOpacityProps {
  name?: string;
  checkStyle?: StyleProp<ViewStyle>;
  text?: string;
  value?: boolean;
  onChangeValue?: (e: boolean) => void;
}

export const Checkbox: FC<CheckboxProps> = props => {
  const {value = false} = props;
  const [show, setShow] = useState(value);
  const {colores} = useContext(contex);
  useEffect(() => setShow(value), [value]);

  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
        },
        props.style,
      ]}
      onPress={e => {
        !value && setShow(!show);
        props.onChangeValue && props.onChangeValue(!show);
        props.onPress && props.onPress(e);
      }}>
      <View style={[styles().Checkbox(show), props.checkStyle]}>
        <FontAwesome6
          name="check"
          color={
            show ? colores.backgroundColor : colores.backgroundColorComponents
          }
          size={16}
        />
      </View>
      {props.text && <Text>{props.text}</Text>}
      {props.children}
    </TouchableOpacity>
  );
};

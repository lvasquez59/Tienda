import {useContext} from 'react';
import {ImageStyle, TextStyle, ViewStyle} from 'react-native';
import {contex} from '../context/Contex';

type style = ViewStyle | TextStyle | ImageStyle;

interface NamedStyles {
  Button: style;
  Text: (e: boolean) => style;
  Checkbox: (e: boolean) => style;
  Input: (e: boolean) => style;
}

export const styles = () => {
  const {colores} = useContext(contex);
  const style: NamedStyles = {
    Button: {
      backgroundColor: colores.backgroundColorComponents,
      marginVertical: 5,
      alignItems: 'center',
      borderRadius: 3,
      width: '90%',
      maxWidth: 400,
      padding: 15,
    },
    Checkbox: (e: boolean) => {
      return {
        backgroundColor: e
          ? colores.backgroundColorComponents
          : colores.backgroundColor,
        borderColor: colores.backgroundColorComponents,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        borderWidth: 1,
        width: 25,
        height: 25,
        marginRight: 10,
      };
    },
    Input: (e: boolean) => {
      return {
        borderBottomWidth: e ? 2 : 1,
        borderColor: e ? 'rgba(58, 185, 212, 1)' : colores.borderColor,
        backgroundColor: colores.backgroundColor,
        shadowColor: colores.shadowColor,
        shadowOffset: {
          width: 3,
          height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2.8,
        elevation: 3,
        borderRadius: 3,
        padding: 15,
        color: colores.backgroundColorComponents,
      };
    },
    Text: e => {
      return {
        color: e ? colores.backgroundColor : colores.backgroundColorComponents,
        fontFamily: 'Helvetica',
        fontSize: 15,
      };
    },
  };
  return style;
};

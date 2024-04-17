import {FC} from 'react';
import {Text as Texto, TextProps} from 'react-native';
import {styles} from '../Theme/Styles';

interface Text extends TextProps {
  /**
   * Bandera qu invierte el color del texto.
   */
  toggled?: boolean;
}

/**
 * Componente funcional que representa un elemento de texto.
 */
export const Text: FC<Text> = props => {
  const {toggled = false} = props;
  return (
    <Texto {...props} style={[styles().Text(toggled), props.style]}>
      {props.children}
    </Texto>
  );
};

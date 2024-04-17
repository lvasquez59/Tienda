import React, {FC} from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {Text} from './Text';
import {styles} from '../Theme/Styles';

export interface ButtonProps extends TouchableOpacityProps {
  text?: string;
  load?: boolean;
}

export const Button: FC<ButtonProps> = props => {
  return (
    <TouchableOpacity
      {...props}
      style={[{opacity: props.load ? 0.2 : 1}, styles().Button, props.style]}>
      {props.text && (
        <Text toggled style={{fontWeight: 'bold'}}>
          {props.text}
        </Text>
      )}
      {props.children}
    </TouchableOpacity>
  );
};

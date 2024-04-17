import {Modal as Mod} from 'react-native';
import React, {Component, FC, useContext, useEffect, useState} from 'react';
import {View} from './View';
import {Text} from './Text';
import {ModalProps as Props} from 'react-native';
import {ViewProps} from 'react-native';
import {Button, ButtonProps} from './Button';
import {contex} from '../context/Contex';
import Toast from 'react-native-toast-message';

interface ModalProps extends Props {
  propsView?: ViewProps;
}
interface ModalPropsButton extends Props {
  propsView?: ViewProps;
  propsButton?: ButtonProps;
}

export interface ModalComponent extends FC<ModalProps> {
  Button: FC<ModalPropsButton>;
}
export const Modal: ModalComponent = props => {
  const {colores} = useContext(contex);
  return (
    <Mod transparent hardwareAccelerated={true} {...props}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, .5)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{zIndex: 9999}}>
          <Toast />
        </View>
        <View.Bbg
          {...props.propsView}
          style={[
            {
              maxWidth: '80%',
              maxHeight: '80%',
              flex: 0,
              borderWidth: 1,
              borderRadius: 15,
              borderColor: colores.shadowColor,
              zIndex: 9900,
            },
            props.propsView?.style,
          ]}>
          {props.children}
        </View.Bbg>
      </View>
    </Mod>
  );
};
Modal.Button = props => {
  return (
    <>
      <Button {...props.propsButton} />
      <Modal {...props} />
    </>
  );
};

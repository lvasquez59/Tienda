import {View as Vista, ViewProps, SafeAreaView as SafeArea} from 'react-native';
import React, {FC, useContext} from 'react';
import {contex} from '../context/Contex';

interface ViewComponent extends FC<ViewProp> {
  Bbg: FC<ViewProp>;
}
interface ViewProp extends ViewProps {
  SafeAreaView?: boolean;
}
export const View: ViewComponent = props => {
  const {SafeAreaView = false} = props;
  return SafeAreaView ? <SafeArea {...props} /> : <Vista {...props} />;
};
View.Bbg = props => {
  const {colores} = useContext(contex);
  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: colores.backgroundColor,
          flex: 1,
        },
        props.style,
      ]}
    />
  );
};

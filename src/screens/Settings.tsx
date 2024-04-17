import React, {useContext, useEffect, useState} from 'react';
import {View} from '../components/View';
import {Text} from '../components/Text';
import {Checkbox} from '../components/Checkbox';
import {contex, temaApp} from '../context/Contex';
import {KeyboardAvoidingView, ScrollView, Switch} from 'react-native';
import {TextInput} from '../components/Input';

export default function Settings() {
  const {
    SetTemaApp,
    colorScheme,
    scan,
    SetScaner,
    comision,
    setComision,
    ip,
    setserver,
  } = useContext(contex);
  const SetTem = (e: temaApp) => {
    SetTemaApp(e);
  };

  return (
    <View.Bbg style={{padding: 30}}>
      <KeyboardAvoidingView>
        <ScrollView>
          <Text>Tema:</Text>
          <Checkbox
            text="System"
            value={colorScheme == temaApp.Sistem}
            onChangeValue={() => SetTem(temaApp.Sistem)}></Checkbox>
          <Checkbox
            text="Claro"
            value={colorScheme == temaApp.Claro}
            onChangeValue={() => SetTem(temaApp.Claro)}></Checkbox>
          <Checkbox
            text="Oscuro"
            value={colorScheme == temaApp.Oscuro}
            onChangeValue={() => SetTem(temaApp.Oscuro)}></Checkbox>

          <Text>Boton Scaner:</Text>
          <Switch value={scan} onValueChange={SetScaner}></Switch>
          <TextInput
            label="Comision"
            enteros
            editable={false}
            value={(Number(comision) * 100).toString()}
            placeholder="Comision"
            onChangeText={setComision}
          />
          <TextInput
            label="Servidor"
            value={ip}
            placeholder="IP"
            onChangeText={setserver}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View.Bbg>
  );
}

import React, {useContext} from 'react';
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
          <View style={{ flexDirection:'row', justifyContent:'space-between',marginVertical:15 }}>
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
          </View>
          <View
            style={{ flexDirection:'row',justifyContent: 'space-between',alignItems: 'center', marginVertical:15}}
          >
          <Text>Boton Scaner:

          </Text>
          <Switch value={scan} onValueChange={SetScaner}></Switch>
          </View>
          <TextInput
            label="Comision"
            containerInputStyle={{ width:'100%', marginVertical:15}}
            enteros
            editable={false}
            value={(Number(comision) * 100).toString()}
            placeholder="Comision"
            onChangeText={setComision}
          />
          <TextInput
            label="Servidor"
            containerInputStyle={{ width:'100%', marginVertical:15}}
            value={ip}
            placeholder="IP"
            onChangeText={setserver}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View.Bbg>
  );
}

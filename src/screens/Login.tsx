import {TextInput as TexRef} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {TextInput} from '../components/Input';
import {Form, FormSubmit} from '../components/Form';
import {Text} from '../components/Text';
import {Checkbox} from '../components/Checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackScreenProps} from '@react-navigation/stack';
import {View} from '../components/View';
import Api from '../utils/api/Api';

export default function Login(props: StackScreenProps<any, 'Login'>) {
  const inputRef2 = useRef<TexRef>(null);
  const [save, setSave] = useState(false);
  const [value, setValue] = useState({email: '', password: ''});

  const remember = async () => {
    const values = await AsyncStorage.getItem('login');
    if (values) {
      setValue(JSON.parse(values));
      setSave(true);
    }
  };

  useEffect(() => {
    remember();
  }, []);

  const submit = async ({values, setErrors}: FormSubmit) => {
    try {
      const {data} = await Api.post('auth/shop/login', values);

      if (data.token) AsyncStorage.setItem('token', data.token);

      if (save) AsyncStorage.setItem('login', JSON.stringify(values));
      else AsyncStorage.removeItem('login');

      props.navigation.navigate('Home');
    } catch (error) {
      setErrors(error);
    }
  };

  return (
    <View.Bbg
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 25, fontWeight: 'bold'}}>Welcome back!</Text>
      <Text style={{marginBottom: 20, marginTop: 10}}>
        Login to your account
      </Text>
      <Form initialValues={value}>
        {({onchange, values, errors}) => {
          return (
            <>
              <TextInput
                isRequired
                name="email"
                placeholder="Username"
                onChangeText={e => onchange(e, 'email')}
                value={values.email}
                errors={errors}
                onSubmitEditing={() => inputRef2.current?.focus()}
                blurOnSubmit={false}
                returnKeyType="next"
                keyboardType="email-address"
              />
              <TextInput
                isRequired
                isPassword
                name="password"
                placeholder="Password"
                onChangeText={e => onchange(e, 'password')}
                value={values.password}
                errors={errors}
                ref={inputRef2}
              />
              <Form.submit
                style={{marginTop: 15}}
                onSubmit={submit}
                text="Log in"
              />
              <View
                style={{
                  width: '90%',
                  maxWidth: 400,
                  marginTop: 10,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Checkbox
                  name="remember"
                  text="Remember me"
                  value={save}
                  onPress={() => setSave(!save)}
                />
                <Text>Forgot your password?</Text>
              </View>
            </>
          );
        }}
      </Form>
    </View.Bbg>
  );
}

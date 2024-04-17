import 'react-native-gesture-handler';
import React from 'react';
import Contex from './src/context/Contex';
import {NavigationContainer} from '@react-navigation/native';
import {TabNavigator} from './src/routes/TabNavigator';
import {LogBox} from 'react-native';
import {DrawerNavigator} from './src/routes/DrawerNavigation';
import {View} from 'react-native-animatable';

function App(): React.JSX.Element {
  LogBox.ignoreLogs([
    'ViewPropTypes will be removed from React Native, along with all other PropTypes',
  ]);
  return (
    <NavigationContainer>
      <Contex>
        <DrawerNavigator />
      </Contex>
    </NavigationContainer>
  );
}

export default App;

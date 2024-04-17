import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Login from '../screens/Home';
import {useContext} from 'react';
import {contex} from '../context/Contex';
import Search from '../screens/Search';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  const {colores} = useContext(contex);
  return (
    <Tab.Navigator
      // tabBar={{}}
      // sceneContainerStyle={{
      //   borderStyle
      // }}
      initialRouteName="Home">
      <Tab.Screen
        name="Home"
        options={{headerShown: false}}
        component={Login}
      />
      <Tab.Screen
        name="Search"
        options={{headerShown: false}}
        component={Search}
      />
    </Tab.Navigator>
  );
}

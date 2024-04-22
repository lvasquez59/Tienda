import {useContext} from 'react';
import {contex} from '../context/Contex';
import Search from '../screens/Search';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useWindowDimensions} from 'react-native';
import Settings from '../screens/Settings';
import Home from '../screens/Home';
import Pesado from '../screens/Pesado';
import Ventas from '../screens/Ventas';

const Drawer = createDrawerNavigator();

export function DrawerNavigator() {
  const {colores} = useContext(contex);
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
        drawerInactiveTintColor: colores.backgroundColorComponents,
        drawerStyle: {left: -50, width: '30%'},
        sceneContainerStyle: {width: useWindowDimensions().width - 50},
      }}
      initialRouteName="Home"
      drawerContent={drawerContent}>
      <Drawer.Screen
        name="Home"
        options={{
          headerShown: false,
          drawerIcon: () => <AntDesign name="home" size={16} color="red" />,
        }}
        component={Home}
      />
      <Drawer.Screen
        name="Search"
        options={{
          drawerLabel: 'Buscar',
          headerShown: false,
          drawerIcon: () => <AntDesign name="search1" size={16} color="red" />,
        }}
        component={Search}
      />
      <Drawer.Screen
        name="Pesado"
        options={{
          headerShown: false,
          drawerIcon: () => (
            <FontAwesome name="balance-scale" size={16} color="red" />
          ),
        }}
        component={Pesado}
      />
      <Drawer.Screen
        name="Ventas"
        options={{
          headerShown: false,
          drawerIcon: () => (
            <AntDesign name="shoppingcart" size={16} color="red" />
          ),
        }}
        component={Ventas}
      />
      <Drawer.Screen
        name="Settings"
        options={{
          headerShown: false,
          drawerIcon: () => <AntDesign name="tool" size={16} color="red" />,
        }}
        component={Settings}
      />
    </Drawer.Navigator>
  );
}

function drawerContent(props: DrawerContentComponentProps) {
  const {colores} = useContext(contex);
  return (
    <DrawerContentScrollView
      // onTouchEnd={() => props.navigation.toggleDrawer()}
      style={{
        width: useWindowDimensions().width + 50,
        backgroundColor: colores.backgroundColor,
      }}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

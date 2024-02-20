import 'react-native-gesture-handler';
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Devices } from './screens/Devices';
import {PowerMeter} from './screens/PowerMeter';
import {AddDevice} from './screens/AddDevice'
import { Settings } from './screens/Settings';
import { DateProvider,PowerProvider } from './Contexts';

const Drawer = createDrawerNavigator();
export default function App() {
    return (
      <DateProvider>
        <PowerProvider>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f4511e', 
            },
            headerTintColor: '#fff', //text colour 
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Drawer.Screen name="Devices" component={Devices} options={{unmountOnBlur:true}}/>
           <Drawer.Screen name="Power Meter" component={PowerMeter} options={{unmountOnBlur:true}}/>
          <Drawer.Screen name="Add Device" component={AddDevice} options={{unmountOnBlur:true}}/>
          <Drawer.Screen name="Settings" component={Settings} /> 
        </Drawer.Navigator>
      </NavigationContainer>
      </PowerProvider>
      </DateProvider>
    );
  }
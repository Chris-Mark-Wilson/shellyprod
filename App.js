import "react-native-gesture-handler";
import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Devices } from "./screens/Devices";
import { PowerMeter } from "./screens/PowerMeter";
import { AddDevice } from "./screens/AddDevice";
import { Settings } from "./screens/Settings";
import { DateProvider, PowerProvider } from "./Contexts";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const Drawers = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff", //text colour
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Drawer.Screen
        name="Devices"
        component={Devices}
        options={{ unmountOnBlur: true }}
      />
      <Drawer.Screen
        name="Add Device"
        component={AddDevice}
        options={{ unmountOnBlur: true }}
      />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <DateProvider>
      <PowerProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="Drawers" component={Drawers} />
            {/* power meter is hidden from drawer menu 
            but is able to use the navigation prop*/}
            <Stack.Screen
        name="Power Meter"
        component={PowerMeter}
        options={{ unmountOnBlur: true }}
        screenOptions={{headerShown:true}}
      />
      {/* other hidden screens go here */}
          </Stack.Navigator>
        </NavigationContainer>
      </PowerProvider>
    </DateProvider>
  );
}

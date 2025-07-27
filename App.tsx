import React, { JSX } from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
    HauntaboutPlay,
    HauntloadingPlay,
    HauntmenuPlay,
    HauntghostcirclePlay,
    HauntdarecursePlay,
    HaunthauntedspyPlay
} from './Playsrc/hauntshr/hauntcompose';

export type RootStackParamList = {
    Hauntaboutplay: undefined;
    Hauntloadingplay: undefined;
    Hauntmenuplay: undefined;
    Hauntghostcircleplay: undefined;
    Hauntdarecurseplay: undefined;
    Haunthauntedspyplay: undefined;
};

enableScreens();

const Stack = createStackNavigator<RootStackParamList>();

function App(): JSX.Element {

  return (
      <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Hauntloadingplay"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen
                    name="Hauntaboutplay"
                    component={HauntaboutPlay}
                />
                <Stack.Screen
                    name="Hauntloadingplay"
                    component={HauntloadingPlay}
                />
                <Stack.Screen
                    name="Hauntmenuplay"
                    component={HauntmenuPlay}
                />
                <Stack.Screen
                    name="Hauntghostcircleplay"
                    component={HauntghostcirclePlay}
                />
                <Stack.Screen
                    name="Hauntdarecurseplay"
                    component={HauntdarecursePlay}
                />
                <Stack.Screen
                    name="Haunthauntedspyplay"
                    component={HaunthauntedspyPlay}
                />
            </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;

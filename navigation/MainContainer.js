import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from './screens/HomeScreen';
import ActivityScreen from './screens/DetailsScreen';
import SettingsScreen from './screens/SettingsScreen';
import DashboardScreen from './screens/ServicesScreen';
import AccountScreen from './screens/Account/AccountScreen';
import MyAccountScreen from './screens/Account/MyAccountScreen';
import ChangePasswordScreen from './screens/Account/ChangePasswordScreen';
import TaskScreen from './screens/TaskScreen';
import ServicesScreen from './screens/ServicesScreen';
import EditTaskScreen from './screens/EditTaskScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeDetails" component={HomeScreen} options={{ headerShown: false, tabBarVisible: false }} />
      <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown:false, tabBarVisible: false }} />
      <Stack.Screen name="My Account" component={MyAccountScreen} options={{ headerShown:false, tabBarVisible: false }} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown:false, tabBarVisible: false }} />
      <Stack.Screen name="Task" component={TaskScreen} options={{ headerShown:false, tabBarVisible: false }} />
      <Stack.Screen name="Edit" component={EditTaskScreen} options={{ headerShown:false, tabBarVisible: false }} />
    </Stack.Navigator>
  );
};

const WalletDetailsStack = () => {
  return (
    <Stack.Navigator>
     <Stack.Screen name="WalletDetails" component={ActivityScreen} options={{ headerShown: false, tabVisible: false }} />
     <Stack.Screen name="Edit" component={EditTaskScreen} options={{ headerShown:false, tabBarVisible: false }} />

    </Stack.Navigator>
  );
};


const ServicesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ServicesDetails" component={ServicesScreen} options={{ headerShown: false, tabNavigatorVisible: false }} />
 
    </Stack.Navigator>
  );
};

const MainContainer = () => {
  return (
    <Tab.Navigator
  initialRouteName="Home"
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      if (route.name === 'Home') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'Tasks') {
        iconName = focused ? 'time' : 'time-outline';
      } else if (route.name === 'Dashboard') {
        iconName = focused ? 'analytics' : 'analytics-outline';
      } else if (route.name === 'Activity') {
        iconName = focused ? 'document-text-outline' : 'document-text-outline';
      }
      return <Ionicons name={iconName} size={size} color={color} />;
    },
  })}
  screenOption={{
    activeTintColor: 'tomato',
    inactiveTintColor: 'tomato',
    labelStyle: { fontSize: 12 },
    style: { height: 60 },
  }}
>
  <Tab.Screen
    name="Home"
    component={HomeStack}
    options={({ route }) => ({
      tabBarVisible: route.state && route.state.index === 0,
    })}
  />
  <Tab.Screen
    name="Tasks"
    component={WalletDetailsStack}
    options={({ route }) => ({
      tabBarVisible: route.state && route.state.index === 0,
    })}
  />
  <Tab.Screen
    name="Dashboard"
    component={ServicesStack}
    options={({ route }) => ({
      tabBarVisible: route.state && route.state.index === 0,
    })}
  />
</Tab.Navigator>

  );
};

export default MainContainer;

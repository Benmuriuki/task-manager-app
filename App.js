import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DelayedOnboardingScreen from './navigation/screens/Aunth/DelayedOnboardingScreen';
import OnboardingScreen from './navigation/screens/Aunth/OnboardingScreen';
import MainContainer from './navigation/MainContainer';
import LoginScreen from './navigation/screens/Aunth/LoginScreen';
import SignUpScreen from './navigation/screens/Aunth/SignUpScreen';
import PasswordResetScreen from './navigation/screens/Aunth/PasswordResetScreen';
import { auth } from './navigation/screens/Aunth/firebase'; // Import Firebase authentication module

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Authentication state change logic remains unchanged
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Clean up the subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Return the navigation container and screens
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoading ? (
          <Stack.Screen
            name="DelayedOnboarding"
            component={DelayedOnboardingScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={SignUpScreen} options={{ headerLeft: null }} />
            <Stack.Screen name="Password Reset" component={PasswordResetScreen} />
            {user && (
              <Stack.Screen
                name="Main"
                component={MainContainer}
                options={{ headerShown: false }}
              />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

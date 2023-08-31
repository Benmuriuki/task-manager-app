import React, { useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';

const DelayedOnboardingScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const delay = setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }],
        })
      );
    }, 2000);

    return () => clearTimeout(delay);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../images/splash.png')} style={styles.image} />
      </View>
      <View style={styles.loadingContainer}></View>
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'stretch', // Updated
  },
  image: {
    width: windowWidth,
    height: windowHeight,
    resizeMode: 'cover',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'cover',
  },
});

export default DelayedOnboardingScreen;

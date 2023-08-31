import React from 'react';
import { StyleSheet, View, SafeAreaView, Image, Text, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';

const OnboardingScreen = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <Swiper style={styles.wrapper} showsButtons={false}>
        {/* Slide 1 */}
        <View style={styles.slide}>
        <Image source={require('../images/new1.jpeg')} style={styles.image} />
          <Text style={styles.title}>my tasks</Text>
          <Text style={styles.description}>manage your tasks in one tap</Text>
          
        </View>

        {/* Slide 2 */}
        <View style={styles.slide}>
        <Image source={require('../images/new2.jpeg')} style={styles.image} />
          <Text style={styles.title}>my tasks</Text>
          <Text style={styles.description}>manage your tasks in one tap</Text>
          
        </View>

        {/* Slide 3 */}
        <View style={styles.slide}>
          <Image source={require('../images/new.jpeg')} style={styles.image} />
          <Text style={styles.title}>my tasks</Text>
          <Text style={styles.description}>manage your tasks in one tap</Text>
        </View>
      </Swiper>

      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={handleGetStarted}
      >
        <Text style={styles.getStartedButtonText}>Skip</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  wrapper: {},
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  getStartedButton: {
    alignSelf: 'center',
    //backgroundColor: '#003580',
    paddingVertical: 12,
    paddingHorizontal: 24,
   // borderRadius: 8,
    marginTop: 20,
  },
  getStartedButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default OnboardingScreen;

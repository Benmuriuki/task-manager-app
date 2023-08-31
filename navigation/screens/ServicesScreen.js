import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ServicesScreen = () => {
  const [amount, setAmount] = useState('');
  const [time, setTime] = useState(0); // Initial time in seconds

  // Load saved time from AsyncStorage on component mount
  useEffect(() => {
    const loadSavedTime = async () => {
      try {
        const savedTime = await AsyncStorage.getItem('elapsedTime');
        if (savedTime !== null) {
          setTime(parseInt(savedTime));
        }
      } catch (error) {
        console.log('Error loading time:', error);
      }
    };

    loadSavedTime();
  }, []);

  // Save time to AsyncStorage whenever it changes
  useEffect(() => {
    const saveTime = async () => {
      try {
        await AsyncStorage.setItem('elapsedTime', time.toString());
      } catch (error) {
        console.log('Error saving time:', error);
      }
    };

    saveTime();
  }, [time]);


  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 1); // Increase time by 1 second
    }, 1000); // Update every 1000ms (1 second)

    return () => {
      clearInterval(interval); // Clean up the interval on unmount
    };
  }, []);

   // Convert time to hours, minutes, and seconds
   const hours = Math.floor(time / 3600);
   const minutes = Math.floor((time % 3600) / 60);
   const seconds = time % 60;


  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Tasks as of Aug, 2023</Text>
      <Text style={styles.headerText1}>5 completed</Text>
      {/* <Image source={require('../../assets/progress.png')} style={styles.image} /> */}
      <Text style={styles.headerText}>Tasks as of Aug, 2023</Text>
      {/* <Text style={styles.headerText2}>2h 33min</Text> */}
      <Text style={styles.headerText2}>{`${hours}h ${minutes}min ${seconds}s`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  image: {
    width: 300,
    height: 250,
    marginBottom: 20,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 80,
  },
  headerText1: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 60,
  },
  headerText2: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    //marginBottom: 80,
  },
});

export default ServicesScreen;

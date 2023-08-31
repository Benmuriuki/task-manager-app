import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const DaysOfWeek = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDayPress = (day) => {
    // Handle the press event for the selected day
    console.log(`Pressed ${day}`);
  };

  return (
    <View style={styles.daysContainer}>
      {days.map((day, index) => (
        <View key={index} style={styles.dayItem}>
          <TouchableOpacity onPress={() => handleDayPress(day)}>
            <View style={styles.dayBorder}>
              <Text style={styles.dayText}>{day}</Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  dayItem: {
    alignItems: 'center',
  },
  dayBorder: {
    borderWidth: 1,
    borderColor: 'tomato',
    borderRadius: 5,
    padding: 5,
    backgroundColor: 'orange',
  },
  dayText: {
    color: 'white',
    fontSize: 16,
  },
});

export default DaysOfWeek;

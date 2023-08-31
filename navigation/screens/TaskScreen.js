import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Platform, TouchableOpacity, Alert} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './Aunth/firebase'; // Update the import path for your firebase.js file
import recommendations from './Recomendation.json'
import stringSimilarity from 'string-similarity';

const TaskScreen = () => {
  const navigation = useNavigation();
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleAddTask = async () => {
    try {
      if (!taskTitle.trim()) {
        Alert.alert('Title is required', 'Please enter a task title.');
        return;
      }
      const userId = auth.currentUser.uid;
  
      // Reference the "tasks" collection
      const tasksCollectionRef = collection(db, 'tasks');
  
      const taskData = {
        userId: userId,
        title: taskTitle,
        description: taskDescription,
        date: date.toISOString(),
        time: time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds(),
        createdAt: serverTimestamp(),
        recommendation: '', // Initialize the recommendation
      };
  
      const similarityThreshold = 0.5; // Set the similarity threshold to 75%
      const lowerCaseTaskTitle = taskTitle.toLowerCase();
  
      // Check if the user's task title has a recommendation
      const recommendationsArray = Object.entries(recommendations);
      const similarRecommendations = recommendationsArray.filter(([recommendationTitle]) => {
        const similarity = stringSimilarity.compareTwoStrings(recommendationTitle.toLowerCase(), lowerCaseTaskTitle);
        return similarity >= similarityThreshold;
      });
  
      if (similarRecommendations.length > 0) {
        const recommendation = similarRecommendations[0][1]; // Get the recommendation text
        taskData.recommendation = recommendation; // Set the recommendation in the task data
        console.log('Recommended:', recommendation);
      }
  
      // Add a new document with an automatically generated unique ID
      const newDocRef = await addDoc(tasksCollectionRef, taskData);
  
      setTaskTitle('');
      setTaskDescription('');
      setDate(new Date());
      setTime(new Date());
  
      console.log('Task added successfully');
      Alert.alert('Task added successfully', 'Task has been added.');
  
      // Log the ID of the newly added task document
      console.log('New task document ID:', newDocRef.id);
  
      navigation.goBack();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
  


  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShowDatePicker(Platform.OS === 'ios');
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
    setShowTimePicker(Platform.OS === 'ios');
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={taskTitle}
        onChangeText={setTaskTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Task Description"
        value={taskDescription}
        onChangeText={setTaskDescription}
      />
      <TouchableOpacity onPress={showDatepicker}>
        <Text style={styles.dateText}>Select Date: {date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}
      <TouchableOpacity onPress={showTimepicker}>
        <Text style={styles.dateText}>Select Time: {time.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          testID="timePicker"
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
      <Button title="Add Task" onPress={handleAddTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  dateText: {
    marginBottom: 8,
    color: 'blue',
  },
});

export default TaskScreen;

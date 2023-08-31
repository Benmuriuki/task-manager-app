import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { db } from './Aunth/firebase'; // Update the import path for your firebase.js file

const EditTaskScreen = ({ route, navigation }) => {
  const [taskId, setTaskId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  useEffect(() => {
    if (route.params) {
      const { id, title, description } = route.params.task;
      setTaskId(id);
      setTaskTitle(title);
      setTaskDescription(description);
    }
  }, [route.params]);

  const handleEditTask = async () => {
    try {
      if (!taskTitle.trim()) {
        Alert.alert('Title is required', 'Please enter a task title.');
        return;
      }

      const taskRef = doc(db, 'tasks', taskId);

      await updateDoc(taskRef, {
        title: taskTitle,
        description: taskDescription,
      });

      console.log('Task edited successfully');
      Alert.alert('Task edited successfully', 'Task has been edited.');
      navigation.goBack();
    } catch (error) {
      console.error('Error editing task:', error);
    }
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
      <Button title="Save Changes" onPress={handleEditTask} />
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
});

export default EditTaskScreen;

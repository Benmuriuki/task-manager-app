import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { query, collection, where, onSnapshot, deleteDoc, doc} from 'firebase/firestore';
import { db, auth } from './Aunth/firebase'; // Update the import path for your firebase.js file
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker} from '@react-native-picker/picker'

const calculateRemainingHours = (taskDate, taskTime) => {
  const currentDate = new Date();
  const taskDateTime = new Date(taskDate + ' ' + taskTime);

  const timeDifference = taskDateTime - currentDate;
  const remainingHours = Math.floor(timeDifference / (1000 * 60 * 60));

  return remainingHours;
};



const ActivityScreen = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [sortingOption, setSortingOption] = useState('time');

  useEffect(() => {
    const userId = auth.currentUser.uid;

    // Reference the "tasks" collection
    const tasksCollectionRef = collection(db, 'tasks');

    // Query the tasks collection for documents with the current user's ID
    const tasksQuery = query(tasksCollectionRef, where('userId', '==', userId));

    const unsubscribeTasks = onSnapshot(tasksQuery, (querySnapshot) => {
      const taskList = [];
      querySnapshot.forEach((doc) => {
        taskList.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setTasks(taskList);
    });

    return () => {
      unsubscribeTasks(); // Clean up the subscription when the component unmounts
    };
  }, []);

  const calculateRemainingTime = (taskDate, taskTime) => {
    const currentDateTime = new Date();
    const taskDateTime = new Date(taskDate + 'T' + taskTime);
  
    const timeDifference = taskDateTime - currentDateTime;
    const remainingHours = Math.floor(timeDifference / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const remainingSeconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  
    return {
      hours: remainingHours,
      minutes: remainingMinutes,
      seconds: remainingSeconds,
    };
  };
  
  const handleDeleteTask = async (taskId) => {
    try {
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this task?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              try {
                await deleteDoc(doc(db, 'tasks', taskId));
                console.log('Task deleted successfully');
              } catch (error) {
                console.error('Error deleting task:', error);
              }
            },
            style: 'destructive',
          },
        ]
      );
    } catch (error) {
      console.error('Error in handleDeleteTask:', error);
    }
  };

   // Sort tasks based on the selected sorting option
   const sortedTasks = [...tasks];
   if (sortingOption === 'time') {
     sortedTasks.sort((a, b) =>
       calculateRemainingTime(a.date, a.time).hours -
       calculateRemainingTime(b.date, b.time).hours
     );
   } else if (sortingOption === 'priority') {
     sortedTasks.sort((a, b) => a.priority - b.priority);
   }

   const navigateToEditScreen = (task) => {
    navigation.navigate('Edit', { task: task });
  };
  return (
    <ScrollView style={styles.container}>
         <View style={styles.sortingContainer}>
        <Text style={styles.sortingLabel}>Categorize by:</Text>
        <Picker
          style={styles.sortingPicker}
          selectedValue={sortingOption}
          onValueChange={(itemValue) => setSortingOption(itemValue)}
        >
          
          <Picker.Item label="Time" value="time" />
          <Picker.Item label="Category" value="category" />
          <Picker.Item label="Priority" value="priority" />
        </Picker>
      </View>
    {tasks.map((task) => (
      <View key={task.id} style={styles.taskContainer}>
        <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        </View>
        <Text
      style={[
        styles.remainingTime,
        {
          color:
            calculateRemainingTime(task.date, task.time).hours >= 5
              ? 'white' // Moderate - White
              : calculateRemainingTime(task.date, task.time).hours < 2
              ? 'red' // High - Red
              : 'yellow', // Low - Yellow
          backgroundColor:
            calculateRemainingTime(task.date, task.time).hours < 2
              ? 'red' // High - Red background
              : 'transparent', // No background for other cases
        },
      ]}
    >
      {calculateRemainingTime(task.date, task.time).hours >= 5
        ? 'Moderate'
        : calculateRemainingTime(task.date, task.time).hours < 2
        ? 'High'
        : 'Low'}
    </Text>
    <Text style={styles.taskDescription}>{task.description}</Text>
    <Text style={styles.recommendationText}> Recommendations: {task.recommendation}</Text>

    <View style={styles.iconsContainer}>
    <TouchableOpacity onPress={() => navigateToEditScreen(task)}>
              <View style={styles.icon}>
            <Ionicons name="create-outline" size={18} color="white" />
            <Text style={styles.iconText}>Edit</Text>
          </View>
          </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteTask(task.id)}>
            <View style={styles.icon}>
                <Ionicons name="trash-outline" size={18} color="red" />
                <Text style={styles.iconText}>Delete</Text>
          </View>
              </TouchableOpacity>
              <TouchableOpacity>
              <View style={styles.icon}>
            {/* <Ionicons name="cloud-download-outline" size={18} color="white" />
            <Text style={styles.iconText}>Export</Text> */}
          </View>
          </TouchableOpacity>
          </View>
      </View>
    ))}
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Change this to your desired background color
  },
  taskContainer: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
borderColor: 'yellow',
    borderRadius: 10,
    backgroundColor: 'blue',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Add this line
    alignItems: 'center', // Add this line if you want icons vertically centered
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginTop: 10,
  },
  icon: {
    alignItems: 'center',
  },

  // Add styles for iconText
  iconText: {
    color: 'white',
    marginTop: 5,
  },
  taskDescription: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },
  remainingTime: {
    fontSize: 16,
    padding: 5,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    backgroundColor: 'green',
    marginLeft: 250,
    marginBottom: 20,
    marginTop: -25,
  },
  sortingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 15,
    paddingTop: 16,
    borderColor: 'black',
    borderWidth: 3,
    borderRadius: 20,
    backgroundColor: 'white',
    marginTop: 10,
  },
  sortingLabel: {
    fontSize: 20,
    color: 'black',
    marginRight: 20,
  },
  sortingPicker: {
    width: 150,
    color: 'black',
  },
  recommendationText: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'yellow',
    borderRadius: 4,
  },
});

export default ActivityScreen;

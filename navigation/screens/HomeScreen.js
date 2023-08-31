import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { onSnapshot, doc, collection, query, where} from 'firebase/firestore';
import { db, auth } from './Aunth/firebase'; // Update the import path for your firebase.js file
import Ionicons from 'react-native-vector-icons/Ionicons';
import DaysOfWeek from './DaysofWeek';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome
import { useRoute } from '@react-navigation/native'; // Import the useRoute hook


const calculateRemainingHours = (taskDate, taskTime) => {
  const currentDate = new Date();
  const taskDateTime = new Date(taskDate + ' ' + taskTime);

  const timeDifference = taskDateTime - currentDate;
  const remainingHours = Math.floor(timeDifference / (1000 * 60 * 60));

  return remainingHours;
};


const HomeScreen = () => {
  const navigation = useNavigation();
  const [greeting, setGreeting] = useState('');
  const [firstName, setFirstName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [todayDate, setTodayDate] = useState('');
  const [todayDay, setTodayDay] = useState('');
  const [tasks, setTasks] = useState([]);
  const [mostRecentTask, setMostRecentTask] = useState(null);

  const route = useRoute(); // Get the current route

  const { recommended } = route.params || {}; // Get the recommendation from params


  const handlePicturePress = () => {
    navigation.navigate('Account');
  };

  const handleAddPress = () => {
    navigation.navigate('Task');
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
  };

  useEffect(() => {
    const getCurrentTime = () => {
      const date = new Date();
      const hours = date.getHours();

      if (hours < 12) {
        setGreeting('Good Morning');
      } else if (hours >= 12 && hours < 16) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }
    };

    getCurrentTime();
  }, []);

  useEffect(() => {
    const unsubscribeUserInfo = onSnapshot(doc(db, 'users', auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        const fullName = userData.name;
        const firstName = fullName.split(' ')[0];
        setFirstName(firstName);

        // Set the profile picture URL from the userData
        setProfilePicture(userData.profilePicture);
      }
    });

    return () => {
      unsubscribeUserInfo(); // Clean up the subscription when the component unmounts
    };
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

    setTodayDate(currentDate.toLocaleDateString(undefined, options));
    setTodayDay(currentDate.toLocaleDateString('en-US', { weekday: 'long' }));

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
   if (taskList.length > 0) {
    // Find the most recent task
    const sortedTasks = taskList.sort(
      (a, b) =>
        new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time)
    );
    setMostRecentTask(sortedTasks[0]);
  } else {
    setMostRecentTask(null);
  }
});
    return () => {
      unsubscribeTasks(); // Clean up the subscription when the component unmounts
    };
  }, []);

  
  // Calculate the completion percentage
  const calculateCompletionPercentage = () => {
    if (tasks.length === 0) {
      return 0; // Return 0% if there are no tasks
    }

    const completedTasks = tasks.filter(task => task.completed);
    const completionPercentage = (completedTasks.length / tasks.length) * 100;

    return completionPercentage.toFixed(2); // Round to 2 decimal places
  };

  const calculateRemainingHours = (taskDate, taskTime) => {
    const currentDate = new Date();
    const taskDateTime = new Date(taskDate + 'T' + taskTime);
  
    const timeDifference = taskDateTime - currentDate;
    const remainingHours = Math.floor(timeDifference / (1000 * 60 * 60));
  
    return remainingHours;
  };
  
  // ... Rest of the code ...
  
  const calculateRemainingTime = (taskDate, taskTime) => {
    const currentDateTime = new Date();
    const [taskHours, taskMinutes] = taskTime.split(':'); // Splitting HH:MM:SS into an array
  
    const taskDateTime = new Date(taskDate);
    taskDateTime.setHours(taskHours);
    taskDateTime.setMinutes(taskMinutes);
    
    const timeDifference = taskDateTime - currentDateTime;
    const remainingMilliseconds = Math.max(timeDifference, 0); // Ensure non-negative value
  
    const remainingHours = Math.floor(remainingMilliseconds / (1000 * 60 * 60));
    const remainingMinutes = Math.floor(
      (remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    );
    const remainingSeconds = Math.floor(
      (remainingMilliseconds % (1000 * 60)) / 1000
    );
  
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
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePicturePress}>
          <View style={styles.pictureHolder}>
            <Image
              source={{ uri: profilePicture }}
              style={styles.picture}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleAddPress}>
            <Ionicons name="add-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleNotificationPress}>
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.greeting}>
        <Text style={styles.title}>{greeting} {firstName},</Text>
        <View style={styles.completionPercentage}>
          <Text style={styles.completionValue}>{calculateCompletionPercentage()}% Done</Text>
        </View>
        <View style={styles.todayInfo}>
          <Text style={styles.todayText}>{todayDate}</Text>
        </View>
        <View style={styles.row}>
        <View style={styles.wordContainer}>
          {/* <Text style={styles.word}>High Priority</Text> */}
        </View>
        <TouchableOpacity>
        <View style={styles.wordContainer}>
          <Text style={styles.word}>Medium Priority</Text>
        </View>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
      <View style={styles.wordContainer}>
            <Text style={styles.word}>Low Priority</Text>
            {tasks.filter(task => calculateRemainingHours(task.date, task.time) > 5).length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {tasks.filter(task => calculateRemainingHours(task.date, task.time) > 5).length}
                </Text>
              </View>
            )}
          </View>
        <View style={styles.wordContainer}>
          <Text style={styles.word}>Active</Text>
        </View>
      </View>
        <View><DaysOfWeek/></View>
        <View style={styles.mostRecentTask}>
  <Text style={styles.mostRecentTitle}>Most Recent Task:</Text>
  {mostRecentTask ? (
    <View style={styles.taskContainer}>
      <View style={styles.taskHeader}>
      <Text style={styles.taskTitle}>{mostRecentTask.title}</Text>
        <Text
          style={[
            styles.remainingTime,
            {
              color:
                calculateRemainingHours(
                  mostRecentTask.date,
                  mostRecentTask.time
                ) >= 5
                  ? 'white'
                  : calculateRemainingHours(
                      mostRecentTask.date,
                      mostRecentTask.time
                    ) < 2
                  ? 'red'
                  : 'yellow',
              backgroundColor:
                calculateRemainingHours(
                  mostRecentTask.date,
                  mostRecentTask.time
                ) < 2
                  ? 'red'
                  : 'transparent',
            },
          ]}
        >
          {calculateRemainingHours(
            mostRecentTask.date,
            mostRecentTask.time
          )}{' '}
           h
        </Text>
      </View>
      <Text style={styles.taskDescription}>{mostRecentTask.description}</Text>
      <Text style={styles.recommendationText}>Recommendations:{mostRecentTask.recommendation}</Text>
      <View style={styles.iconsContainer}>
      <TouchableOpacity>
              <View style={styles.icon}>
            {/* <Ionicons name="create-outline" size={18} color="white" /> */}
            {/* <Text style={styles.iconText}>Edit</Text> */}
          </View>
          </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteTask(task.id)}>
            {/* <View style={styles.icon}>
                <Ionicons name="trash-outline" size={18} color="red" />
                <Text style={styles.iconText}>Delete</Text>
          </View> */}
              </TouchableOpacity>
              <TouchableOpacity>
              <View style={styles.icon}>
            {/* <Ionicons name="cloud-download-outline" size={18} color="white" /> */}
            {/* <Text style={styles.iconText}>Export</Text> */}
          </View>
          </TouchableOpacity>
          </View>
    </View>
  ) : (
    <Text style={styles.noRecentTask}>No recent tasks</Text>
        )}
      </View>
      </View>
      <View style={styles.bottomRightIcon}>
        <TouchableOpacity onPress={handleAddPress}>
          <Ionicons name="add-circle-outline" size={80} color="white" />
        </TouchableOpacity>
        <Text style={styles.bottomCenterText}>Add Task</Text>
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    borderRadius: 20, // Add border
    borderColor: 'tomato', // Border color
    backgroundColor: 'blue', // Background color
    height: 80, // Height of
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  pictureHolder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 10,
  },
  picture: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    margin: -160, // Adjust the margin as needed
    marginLeft: 190,
  },
  greeting: {
    marginTop: 20,
    borderRadius: 15, // Add border
    borderColor: 'gray', // Border color
    backgroundColor: 'black', // Background color
    height: 80, // Height of
  },
  bottomRightIcon: {
    position: 'absolute',
    bottom: 2,
    marginLeft: 140,
  },
  bottomCenterText: {
    color: 'white',
    fontSize: 22,
    marginTop: 5,
  },
  todayInfo: {
    alignItems: 'center',
    marginTop: 20,
    marginRight: 200,
  },
  todayText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 8,
  },
  taskList: {
    marginTop: 20,
    borderRadius: 40, // Add border
    borderColor: 'tomato', // Border color
    backgroundColor: 'blue', // Background color
  },
  taskItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  taskDescription: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  countdownContainer: {
    backgroundColor: 'blue',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  countdownText: {
    color: 'white',
    fontSize: 16,
  },
   row: {
    flexDirection: 'row',
    marginTop: 10,
  },
  wordContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    margin: 5,
    backgroundColor: 'white',
  },
  word: {
    fontSize: 18,
    padding: 10,
    color: 'black',
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  completionPercentage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -25,
    marginLeft: 250,
    borderWidth: 0,
    borderColor: 'aqua',
    backgroundColor: 'aqua',
    borderRadius: 8,
    padding: 5,
  },
  completionText: {
    fontSize: 16,
    color: 'white',
    marginRight: 5,
  },
  completionValue: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  mostRecentTask: {
    marginTop: 5,
    paddingHorizontal: 15,
  },
  taskContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    backgroundColor: 'blue',
    padding: 10,
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
  recommendationText: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
    borderWidth: 2,
    borderColor: 'yellow',
    borderRadius: 4,
    marginTop: 20,
    paddingBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  // Add styles for iconText
  iconText: {
    color: 'white',
    marginTop: 5,
  },
});

export default HomeScreen;

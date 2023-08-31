import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth } from "../Aunth/firebase"; 

const AccountScreen = () => {
  const navigation = useNavigation();

  const data = [
    { title: 'Profile', icon: 'person-outline', screen: 'My Account' },
    { title: 'Notifications', icon: 'notifications-outline', screen: 'Promotion' },
    { title: 'Reminder', icon: 'wallet-outline', screen: 'FinancialAccountsScreen' },
    { title: 'Calendar', icon: 'calendar-outline', screen: 'History' },
    { title: 'Security', icon: 'shield-outline', screen: 'ChangePassword' },
    { title: 'Logout', icon: 'log-out-outline', screen: 'LoginScreen' },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await auth.signOut();
              navigation.navigate('Login'); // Replace 'LoginScreen' with your actual login screen name
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderListItem = ({ item }) => {
    if (item.title === 'Logout') {
      return (
        <TouchableOpacity style={styles.listItem} onPress={handleLogout}>
          <Ionicons name={item.icon} size={24} color="black" />
          <Text style={styles.listItemText}>{item.title}</Text>
        </TouchableOpacity>
      );
    } else {
      const onPressItem = () => {
        navigation.navigate(item.screen);
      };

      return (
        <TouchableOpacity style={styles.listItem} onPress={onPressItem}>
          <Ionicons name={item.icon} size={24} color="black" />
          <Text style={styles.listItemText}>{item.title}</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>My Account</Text>
      <View style={styles.sectionContainer}>
        <FlatList
          data={data}
          renderItem={renderListItem}
          keyExtractor={(item) => item.title}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionContainer: {
    marginTop: 16,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  listItemText: {
    marginLeft: 16,
    fontSize: 16,
  },
});

export default AccountScreen;

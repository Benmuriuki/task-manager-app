import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { reauthenticateWithCredential, updatePassword, auth } from '../Aunth/firebase'; // Update the import path for your firebase.js file
import { Ionicons } from '@expo/vector-icons';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = () => {
    if (
      currentPassword === '' ||
      newPassword === '' ||
      confirmPassword === ''
    ) {
      Alert.alert('Invalid Details', 'Please enter all the credentials', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    } else if (newPassword !== confirmPassword) {
      Alert.alert('Password Mismatch', 'New passwords do not match');
    }
    else if (currentPassword == confirmPassword && newPassword) {
      Alert.alert('Password Change Unsuccessful', 'New passwords cannot be same with current password');
    }else {
      const user = auth.currentUser;
      const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);

      user
        .reauthenticateWithCredential(credential)
        .then(() => {
          user
            .updatePassword(newPassword)
            .then(() => {
              Alert.alert(
                'Success',
                'Your password has been changed successfully.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            })
            .catch((error) => {
              console.error('Error updating password: ', error);
              Alert.alert(
                'Error',
                'Failed to update password. Please try again.',
                [
                  {
                    text: 'OK',
                    onPress: () => console.log('OK Pressed'),
                  },
                ]
              );
            });
        })
        .catch((error) => {
          console.error('Error reauthenticating user: ', error);
          Alert.alert(
            'Invalid Current Password',
            'Please enter your current password correctly.',
            [
              {
                text: 'OK',
                onPress: () => console.log('OK Pressed'),
              },
            ]
          );
        });
    }
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Password</Text>
          <View style={styles.passwordInput}>
            <TextInput
              value={currentPassword}
              onChangeText={(text) => setCurrentPassword(text)}
              secureTextEntry={!showCurrentPassword}
              placeholder="Enter your current password"
              placeholderTextColor="black"
              style={styles.input}
            />
            <Pressable
              style={styles.visibilityIcon}
              onPress={toggleCurrentPasswordVisibility}
            >
              <Ionicons
                name={showCurrentPassword ? 'eye' : 'eye-off'}
                size={24}
                color="black"
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.passwordInput}>
            <TextInput
              value={newPassword}
              onChangeText={(text) => setNewPassword(text)}
              secureTextEntry={!showNewPassword}
              placeholder="Enter your new password"
              placeholderTextColor="black"
              style={styles.input}
            />
            <Pressable
              style={styles.visibilityIcon}
              onPress={toggleNewPasswordVisibility}
            >
              <Ionicons
                name={showNewPassword ? 'eye' : 'eye-off'}
                size={24}
                color="black"
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordInput}>
            <TextInput
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              secureTextEntry={!showConfirmPassword}
              placeholder="Confirm your new password"
              placeholderTextColor="black"
              style={styles.input}
            />
            <Pressable
              style={styles.visibilityIcon}
              onPress={toggleConfirmPasswordVisibility}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye' : 'eye-off'}
                size={24}
                color="black"
              />
            </Pressable>
          </View>
        </View>
      </View>

      <Pressable onPress={handleChangePassword} style={styles.button}>
        <Text style={styles.buttonText}>Change Password</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    marginTop: 8,
    padding: 10,
  },
  input: {
    flex: 1,
  },
  visibilityIcon: {
    padding: 8,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ChangePasswordScreen;

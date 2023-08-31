import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, KeyboardAvoidingView, TextInput, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';

const PasswordResetScreen = () => {
  const [resetEmail, setResetEmail] = useState('');
  const navigation = useNavigation();

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        console.log('Password reset email sent');
        Alert.alert('Password reset email', 'A password reset link has been sent to your email.', [
          { text: 'OK', onPress: () => navigation.goBack() } // Navigate back to the previous screen
        ]);
        // Display a success message or navigate to a confirmation screen
      })
      .catch((error) => {
        console.log('Password reset error:', error);
        // Display an error message or handle the error appropriately
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Forgot your Password?</Text>
          <Text style={styles.subtitle}>Enter your email to reset your password</Text>
        </View>

        <View style={styles.formContainer}>
          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={resetEmail}
              onChangeText={(text) => setResetEmail(text)}
              placeholder="Enter your email"
              placeholderTextColor="black"
              style={styles.input}
            />
          </View>
        </View>

        <Pressable onPress={handlePasswordReset} style={styles.button}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  title: {
    color: 'tomato',
    fontSize: 17,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '500',
  },
  formContainer: {
    marginTop: 50,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: 'gray',
  },
  input: {
    fontSize: 18,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginVertical: 10,
    width: 300,
  },
  button: {
    width: 200,
    backgroundColor: 'tomato',
    padding: 15,
    borderRadius: 7,
    marginTop: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default PasswordResetScreen;

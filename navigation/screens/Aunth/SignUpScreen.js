import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, KeyboardAvoidingView, Pressable, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, setDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from "./firebase"; // Update the import path for your firebase.js file
import { Linking } from 'react-native';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const DEFAULT_PROFILE_PICTURE_URL = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // Using the local path directly

  

  const register = async () => {
    if (!agreedToTerms) {
      Alert.alert('Agree to Terms', 'Please agree to the privacy and policies before registering.', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
      return;
    }

    if (
      email === '' ||
      password === '' ||
      phone === '' ||
      name === '' ||
      confirmPassword === ''
    ) {
      Alert.alert('Invalid Details', 'Please enter all the credentials', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    } else if (!validatePhoneNumber(phone)) {
      Alert.alert(
        'Invalid Phone Number',
        'Phone number must start with 07 or 01 and be 10 digits long.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
    } else if (!isPasswordStrong(password)) {
      Alert.alert(
        'Weak Password',
        'Password must contain at least 8 characters, including uppercase, lowercase, special character, and numeric value'
      );
    } else if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
    } else {
      const phoneNumber = `${phone}`;
    
      // Check if the phone number already exists in the database
      const phoneNumberExists = await checkPhoneNumberExists(phoneNumber);
      if (phoneNumberExists) {
        Alert.alert('Phone Number Already Exists', 'The provided phone number is already registered.');
      } else {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          const uid = user.uid;
      
          // Create user document
          await setDoc(doc(db, 'users', uid), {
            email: user.email,
            phone: phoneNumber,
            name: name,
            profilePicture: DEFAULT_PROFILE_PICTURE_URL, 
          });
      
 // Create initial balance document
 const initialBalance = 50; // Set the initial balance
 await setDoc(doc(db, 'balances', uid), {
   balance: initialBalance,
 });


          // Registration successful, navigate to HomeScreen with the username
          navigation.navigate('Home', { uid: uid });
        } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          Alert.alert('Registration Error', errorMessage);
          console.error(`Registration error: ${errorCode} - ${errorMessage}`);
        }
      }
    }
  };

  // Function to check if a phone number already exists in the database
  const checkPhoneNumberExists = async (phoneNumber) => {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(query(usersRef, where('phone', '==', phoneNumber)));
    return !querySnapshot.empty;
  };

  const openTermsLink = () => {
    const termsUrl = 'https://one-teller.doughwriters.com/40/terms-and-conditions/';
    Linking.openURL(termsUrl);
  };

  const isPasswordStrong = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePhoneNumber = (text) => {
    const phoneNumberRegex = /^(07|01)\d{8}$/;
    return phoneNumberRegex.test(text);
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Image source={require('../images/icon3.png')} style={styles.image} />
        <View style={styles.titleContainer}>
          <Text style={styles.subtitle}>Welcome to MyTasks</Text>
          <Text style={styles.subtitle}>Create an account and manage your tasks with one tap.</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder="Name"
              placeholderTextColor="grey"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
  
    <TextInput
      value={phone}
      onChangeText={(text) => setPhone(text)} // Update the phone state
      placeholder="Phone Number"
      placeholderTextColor="grey"
      keyboardType="numeric"
      style={styles.input}
    />
</View>

          <View style={styles.inputContainer}>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Email"
              keyboardType='email-address'
              placeholderTextColor="grey"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={!showPassword}
              placeholder="Password"
              placeholderTextColor="grey"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              secureTextEntry={!showPassword}
              placeholder="Confirm Password"
              placeholderTextColor="grey"
              style={styles.input}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <Pressable
              style={[styles.checkbox, agreedToTerms && styles.checkedCheckbox]}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
            </Pressable>
            <Text style={styles.checkboxLabel}>I agree with the </Text>
            <Pressable onPress={openTermsLink}>
              
              <Text style={styles.checkboxLabels}>privacy and policies</Text>
            </Pressable>
          </View>
        </View>

        <Pressable onPress={register} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>

        <Pressable onPress={() => navigation.goBack()} style={styles.signInLink}>
          <Text style={styles.signInTextLeft}>Already have an account?</Text>
          <Text style={styles.signInTextRight}>Sign In</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 0,
  },
  formContainer: {
    width: '80%',
  },
  inputContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    fontSize: 18,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  button: {
    width: 300,
    backgroundColor: '#00040a',
    padding: 15,
    borderRadius: 7,
    marginTop: 5,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  buttonText: {
    color: '#f2bb05',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signInLink: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signInTextLeft: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'left',
  },
  signInTextRight: {
    color: '#f2bb05',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  countryPickerButton: {
    padding: 10,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  // Styles for the checkbox
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#000',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  checkboxLabels: {
    fontSize: 16,
    fontWeight: 'normal',
    color: 'blue',
  },
});

export default RegisterScreen;

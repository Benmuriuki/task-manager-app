import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable, Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { CheckBox } from 'react-native-elements';


const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State variable to toggle password visibility
  const navigation = useNavigation();
  const [rememberMe, setRememberMe] = useState(false);
  



  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("user credential", userCredential);
        const user = userCredential.user;
        console.log("user details", user);

        // Navigate to the home screen or perform other actions upon successful login
        navigation.navigate("Main", { userName: user.displayName });
      })
      .catch((error) => {
        console.log("login error", error);
        Alert.alert('Wrong Password or Email', 'Kindly check your email and try again');

        // Display an error message or handle the error appropriately
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate('Main');
      }
    });

    return unsubscribe;
  }, []);
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
    });

    return unsubscribe;
  }, [navigation]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.titleContainer}>
        <Image source={require('../images/icon.png')} style={styles.image} />
        </View>

        <View style={styles.formContainer}>
          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter your email"
              keyboardType="email-address"
              placeholderTextColor="grey"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword state
              placeholder="Enter your password"
              placeholderTextColor="grey"
              style={styles.input}
            />
            <Pressable onPress={togglePasswordVisibility} style={styles.showHideButton}>
              <Text style={styles.showHideButtonText}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </Pressable>
          </View>
          <View style={styles.rowContainer}>
          <CheckBox
            title="Remember me"
            checked={rememberMe}
            onPress={() => setRememberMe(!rememberMe)}
            containerStyle={styles.checkBoxContainer}
            textStyle={styles.checkBoxText}
          />
        <Pressable
          onPress={() => navigation.navigate("Password Reset")}
          style={styles.forgotPasswordLink}
        >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
       </Pressable>
       </View>

        </View>

        <Pressable onPress={login} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
 <View style={styles.rowContainer}>
  <Text style={styles.dontHaveAccountText}>Don't have an account?</Text>
  <Pressable
    onPress={() => navigation.navigate("Register")}
    style={styles.createAccountLink}
  >
    <Text style={styles.createAccountText}>Create an account</Text>
  </Pressable>
</View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  title: {
    color: "#003580",
    fontSize: 17,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "500",
  },
  formContainer: {
    marginTop: 50,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
  },
  input: {
    fontSize: 18,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    marginVertical: 10,
    width: 350,
    paddingHorizontal: 20,  // Add horizontal padding
    paddingVertical: 10,    // Add vertical padding
    borderWidth: 1,         // Add border width
    borderColor: 'gray',    // Specify border color
    borderRadius: 5,        // Add border radius
  },
  button: {
    width: 300,
    backgroundColor: "#00040a",
    padding: 15,
    borderRadius: 7,
    marginTop: 20,
    marginLeft: "auto",
    marginRight: "auto",
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  signUpLink: {
    marginBottom: 10,
  },
  signUpText: {
    textAlign: "center",
    color: "#f2bb05",
    fontSize: 17,
  },
  showHideButton: {
    position: "absolute",
    right: 5,
    bottom: 10,
  },
  showHideButtonText: {
    color: "#00040a",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 150,
    // add other styles for the image
  },
  checkBoxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    marginTop: 10,
    marginLeft: 0,
  },
  checkBoxText: {
    fontSize: 16,
    fontWeight: 'normal',
    marginLeft: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  forgotPasswordText: {
    textAlign: "left",
    color: "#f2bb05", // Apply the desired color here
    fontSize: 17,
    alignSelf: "flex-end"
  },
  dontHaveAccountText: {
    fontSize: 17,
    marginRight: 5,
  },
  createAccountLink: {
    marginLeft: 5,
  },
  createAccountText: {
    fontSize: 17,
    color: "#f2bb05", // Apply the desired color here
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#00040a",
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  
  
  
});

export default LoginScreen;

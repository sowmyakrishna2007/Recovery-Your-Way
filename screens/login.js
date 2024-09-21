import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar
} from 'react-native';
import CustomText from '../customText';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import CustomTextInput from '../customTextInput';
export default function Login() {
  const { login } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email.trim() !== '' && password.trim() !== '') {
      try {
        await login(email, password);
        // Navigate to another screen on successful login if needed
      } catch (error) {
        setEmail('');
        setPassword('');
      }
    } else {
      Alert.alert("Login Error", "Please fill out all fields");
    }
  };

  // Get the height of the status bar (only on Android)
  const statusBarHeight = Platform.OS == 'android' ? StatusBar.currentHeight : 0;
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
        <KeyboardAvoidingView
          style={[styles.inner, { paddingTop: statusBarHeight }]} // Add paddingTop for status bar
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardShouldPersistTaps='handled'
        >
          <Image source={require('./logo.png')} style={styles.logo} />
          <View style={styles.inputContainer}>
            <View style={styles.outsideInput}>
              <CustomTextInput
                style={styles.TextInput}
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
                placeholderTextColor='rgba(124, 123, 123, 0.6)'
              />
            </View>
            <View style={styles.outsideInput}>
              <CustomTextInput
                secureTextEntry={true}
                style={styles.TextInput}
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                autoCapitalize='none'
                placeholderTextColor='rgba(125, 125, 125, 0.6)'
              />
            </View>
          </View>
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <CustomText style={styles.buttonText}>Login</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Reset")} style={styles.registerLink}>
            <CustomText style={styles.registerLinkText}>Forgot Password?</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("More Info")} style={styles.button_other}>
            <CustomText style={styles.buttonTextOther}>More Info</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.registerLink}>
            <CustomText style={styles.registerLinkText}>Don't have an account? Register here!</CustomText>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    resizeMode: 'contain',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  outsideInput: {
    width: '60%',
    borderBottomColor: '#05532b',
    borderBottomWidth: 2,
    marginTop: 10,
    marginBottom: 10,
  },
  TextInput: {
    fontSize: 17,
    color: 'black',
    textAlign: 'left',
    padding: 12,
    width: '100%',
  },
  button: {
    marginTop: '5%',
    width: '60%',
    backgroundColor: '#05532b',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
  },
  buttonTextOther: {
    color: '#05532b',
    fontSize: 17,
  },
  button_other: {
    width: '60%',
    backgroundColor: '#ffffff',
    padding: 17,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#05532b',
    marginTop: '10%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 15,
  },
  registerLinkText: {
    fontSize: 16,
    color: '#05532b',
  },
});
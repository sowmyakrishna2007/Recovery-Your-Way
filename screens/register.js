import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Image, Modal, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseConfig';
import CustomText from '../customText';
import CustomTextInput from '../customTextInput';
import { useNavigation } from '@react-navigation/native';
import { ToSPP } from './documents';
import { ScrollView } from 'react-native-gesture-handler';

export default function Register(props) {
  const navigation = useNavigation();
  const auth = getAuth(app);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUserName] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // State for modal
  const [isChecked, setChecked] = useState(false); // State for custom checkbox

  const handleRegister = async () => {
    if (email.trim() != '' && username.trim() != '' && password.trim() != '') {
      if (isChecked) { // Ensure the checkbox is checked
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          await updateProfile(user, { displayName: username });
          navigation.navigate('Login');
        } catch (error) {
          if (error.message == "Firebase: Error (auth/email-already-in-use).") {
            Alert.alert('Registration Error', "Email already in use");
          } else if (error.message == "Firebase: Password should be at least 6 characters (auth/weak-password).") {
            Alert.alert('Registration Error', "Password should be at least 6 characters long.");
          } else if (error.message == "Firebase: Error (auth/invalid-email).") {
            Alert.alert('Registration Error', "Please enter a valid email");
          } else {
            Alert.alert('Registration Error', "There was an error registering.");
          }
        }
      } else {
        Alert.alert("Registration Error", "Please accept the Terms of Service and Privacy Policy");
      }
    } else {
      Alert.alert("Registration Error", "Please fill out all fields");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={[styles.inner, styles.scrollContainer]} keyboardShouldPersistTaps='handled'>
          <Image source={require('./logo.png')} style={styles.logo} />

          <View style={styles.form}>
            <View style={styles.outsideInput}>
              <CustomTextInput
                style={styles.TextInput}
                placeholder='Email'
                value={email}
                onChangeText={text => setEmail(text)}
                autoCapitalize='none'
                placeholderTextColor='rgba(124, 123, 123, 0.6)'
              />
            </View>
            <View style={styles.outsideInput}>
              <CustomTextInput
                style={styles.TextInput}
                placeholder='Username'
                value={username}
                maxLength={18}
                onChangeText={text => setUserName(text)}
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
                onChangeText={text => setPassword(text)}
                autoCapitalize='none'
                placeholderTextColor='rgba(125, 125, 125, 0.6)'
              />
            </View>

            {/* Custom checkbox for Terms of Service */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity style={styles.checkbox} onPress={() => setChecked(!isChecked)}>
                <View style={isChecked ? styles.checkedBox : styles.uncheckedBox}></View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <CustomText style={styles.checkboxLabel}>I agree to the Terms of Service and Privacy Policy</CustomText>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <CustomText style={styles.buttonCustomText}>Register</CustomText>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Modal for Terms of Service */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <ScrollView style={styles.modalContent}>
              <CustomText style={styles.modalTitle}>Terms of Service and Privacy Policy</CustomText>
              <CustomText style={styles.modalText}>
                {ToSPP}
              </CustomText>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                <CustomText style={styles.modalCloseText}>Close</CustomText>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    marginTop: '10%'
  },
  outsideInput: {
    width: '60%',
    borderBottomColor: '#05532b',
    borderBottomWidth: 2,
    marginTop: 10,
    marginBottom: 10,
  },
  form: {
    alignItems: 'center',
    width: '100%',
  },
  TextInput: {
    fontSize: 17,
    color: 'black',
    padding: 12,
    width: '100%',
  },
  button: {
    marginTop: '10%',
    width: '60%',
    backgroundColor: '#05532b',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonCustomText: {
    color: '#fff',
    fontSize: 17,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
    width:'60%',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 8,
  },
  checkedBox: {
    width: 20,
    height: 20,
    backgroundColor: '#05532b',
    borderRadius: 4,
  },
  uncheckedBox: {
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
    borderRadius: 4,
    borderColor: '#05532b',
    borderWidth: 2,
  },
  checkboxLabel: {
    color: '#05532b',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#05532b',
  },
  modalText: {
    fontSize: 14,
    color: '#333',
  },
  modalCloseButton: {
    marginVertical: 30,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#05532b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logo: {
    width: 300,
    resizeMode: 'contain',
  },
});
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import CustomText from '../customText';
import { Platform } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseConfig';
import CustomTextInput from '../customTextInput';
import { url } from '../urls';
import { Image } from 'react-native';
export default function MoreInfo(props) {
    const navigation = useNavigation();
    const auth = getAuth(app)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUserName] = useState('')

    
    
    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('./logo.png')} style={styles.logo} />

            <CustomText style={styles.desc}>Recovery Your Way isn't your traditional 12 step or abstinence-based program. 
Our goal first and foremost is recovery. This program accepts all walks of life and we won't judge you here for the way you choose to recover. At the end of the day we strive to help people battle this disease of addiction.{"\n\n"}

Through this app, you will go about recovery through the Five Pillars program, which prioritizes progress in employment, recovery-focused care, financial stability, self care, and building a support network. </CustomText>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        
        
    },
    intro: {
        marginTop: '5%',
        fontSize: 55,
        color: '#05532b',
    },
    intro_other: {
        fontSize: 40,
        color: '#05532b'
    },
    sub: {
        fontSize: 30,
        color: '#05532b',
    },
    form: {
        alignItems: 'center',
        width: '100%'
    },
    TextInput: {
        fontSize: 20,
        color: 'black',
        borderBottomWidth: 2,
        marginTop: 10,
        marginBottom: 10,
        borderColor: 'white',
        width: '60%',
        padding: 12,
        borderRadius: 2,
        borderBottomColor: '#05532b',
      },
    button: {
        marginTop: '10%',
        width: '60%',
        backgroundColor: '#05532b',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center'
    },
    buttonCustomText: {
        color: '#fff',
        fontSize: 20
    },
    desc: {
        fontSize: 17,
        width: '80%',
        textAlign: 'center',
        color: '#05532b',
        marginTop: 20
    },
    logo: {
        width: 300,
        resizeMode: 'contain',
        marginTop: '10%',
      },
});
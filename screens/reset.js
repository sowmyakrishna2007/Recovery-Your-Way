import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import CustomText from '../customText';
import CustomTextInput from '../customTextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Reset(props) {
    const { resetPassword } = useAuth();
    const navigation = useNavigation();
    const [email, setEmail] = useState('');

    const handleReset = async () => {
        try {
            const response = await resetPassword(email);
            navigation.navigate("Login");
        } catch (error) {
            console.error('Reset password error:', error.message);
            // Handle reset password error (e.g., display error message to user)
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <SafeAreaView style={styles.innerContainer}>
                <Image source={require('./logo.png')} style={styles.logo} />
                    <View style={styles.inputContainer}>
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
                    </View>
                    <TouchableOpacity onPress={handleReset} style={styles.button}>
                        <CustomText style={styles.buttonCustomText}>Reset Password</CustomText>
                    </TouchableOpacity>
                </SafeAreaView>
            </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    innerContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: '30%'
    },
    intro: {
        fontSize: 55,
        color: '#05532b',
    },
    intro_other: {
        fontSize: 40,
        color: '#05532b',
    },
    sub: {
        fontSize: 30,
        color: '#05532b',
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
        marginBottom: 10,
    },
    TextInput: {
        fontSize: 17,
        color: 'black',
        borderColor: 'white',
        padding: 12,
        borderRadius: 2,
        width: '100%',
    },
    button: {
        width: '60%',
        backgroundColor: '#05532b',
        padding: 15,
        marginTop: '9%',
        borderRadius: 15,
        alignItems: 'center',
    },
    buttonCustomText: {
        color: 'white',
        fontSize: 17,
    },
});
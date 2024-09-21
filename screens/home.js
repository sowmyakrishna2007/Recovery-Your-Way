import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import CustomText from '../customText';
import CustomTextInput from '../customTextInput';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import PillarModal from '../components/PillarModal';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseConfig';
import { useAuth } from '../AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { url } from '../urls';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';


export default function Home(props) {
    const auth = getAuth(app);
    const [selfCareOpen, changeSelfCareOpen] = useState(false);
    const [financialSecurityOpen, changeFinancialSecurityOpen] = useState(false);
    const [supportNetworkOpen, changeSupportNetworkOpen] = useState(false);
    const [employmentOpen, changeEmploymentOpen] = useState(false);
    const [recoveryFocusOpen, changeRecoveryFocusOpen] = useState(false);
    const [createPledgeOpen, changePledgeOpen] = useState(false);
    const [pledge, setPledge] = useState('');
    const  [notifId, setNotifId] = useState(null)
    const navigation = useNavigation();
    const { user } = useAuth();
    async function cancelNotification(notificationId) {
        try {
          await Notifications.cancelScheduledNotificationAsync(notificationId);
        } catch (error) {
          null;
        }
      }

    async function scheduleNotificationHandler(pledge) {
        try {
          const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: "Pledge Reminder",
              body: pledge, // Use task description as the body of the notification
            },
            trigger: {
                hour: 7, // 7 AM
                minute: 0,
                repeats: true, // Repeat every day
              },
          });
          return notificationId;
        } catch (error) {
          return null;
        }
      }

    function selfCareChange() {
        changeSelfCareOpen(false);
    }
    function financialSecurityChange() {
        changeFinancialSecurityOpen(false);
    }
    function supportNetworkChange() {
        changeSupportNetworkOpen(false);
    }
    function employmentChange() {
        changeEmploymentOpen(false);
    }
    function recoveryFocusChange() {
        changeRecoveryFocusOpen(false);
    }
    async function storePledge() {
        try {
            if (notifId != null) {
                await cancelNotification(notifId);
            }
            const id = user.uid;
            const notificationId = await scheduleNotificationHandler(pledge)
            const token = await user.getIdToken();
            await axios.put(
                `${url}/users/${id}/pledge.json?auth=${token}`,
                { pledge: pledge,
                notificationId: notificationId }
            );
        } catch (error) {
            console.error('Error storing pledge:', error);
            Alert.alert("Error","There was an error storing your pledge.")
        }
    }

    function onPledgePress() {
        changePledgeOpen(false);
        storePledge();
    }

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
                if (user) {
                    try {
                        const id = user.uid;
                        const token = await user.getIdToken();
                        const response = await fetch(`${url}/users/${id}/pledge.json?auth=${token}`);
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        const data = await response.json();
                        setPledge(data?.pledge || '');
                        setNotifId(data?.notificationId || null)
                    } catch (error) {
                        console.error('Error fetching pledge:', error);
                    }
                }
            }
            fetchData();
            return () => setPledge('');
        }, [user])
    );

    return (
        <View style={styles.container}>
            <PillarModal title="SELF CARE" desc="Self-care encourages constructive health effects of living longer and being better armed to manage stressors. By taking care of ones emotional, physical &amp; Spiritual aspects of life such as taking a break if needed, going for walks, getting enough sleep, and many other self-care routines you can use to stay healthy and capable of doing your job to become financially stable. Self-care need not cost anything, just do the things that you enjoy." open={selfCareOpen} pressed={selfCareChange} category="Self Care"/>
            <PillarModal title="FINANCIAL STABILITY" desc="Financial Stability is important, it lets you have an enjoyable life, not having to worry about money so much when you have a balance between income and expenses, pay off debt, and invest in yourself." open={financialSecurityOpen} pressed={financialSecurityChange} category="Financial Stability"/>
            <PillarModal title="SUPPORT NETWORK" desc="A support network can comprise family, friends, professionals, or anyone who give you support. It is important to your well-being and mental health and can help you deal with daily stressors and achieve success in personal and professional accomplishments." open={supportNetworkOpen} pressed={supportNetworkChange} category="Support Network"/>
            <PillarModal title="EMPLOYMENT" desc="Employment is a way to attain financial security by getting paid for services done for trade work or a career." open={employmentOpen} pressed={employmentChange} category="Employment"/>
            <PillarModal title="RECOVERY FOCUS" desc="Recovery-focused care is a model for mental health recovery that works to give people the power to make decisions about their own lives and mental health. Recovery-focused care help with gaining personal, social, and emotional well-being to recover from a mental health disorder." open={recoveryFocusOpen} pressed={recoveryFocusChange} category="Recovery Focus"/>

            <Modal animationType="fade" visible={createPledgeOpen} transparent={true}  >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <CustomText style={styles.intro_modal}>YOUR PLEDGE</CustomText>
                            <CustomText style={styles.desc_modal}>In this box, enter a pledge you will create for yourself on your journey to recovery!</CustomText>
                            <CustomTextInput
                                multiline={true}
                                onChangeText={text => setPledge(text)}
                                defaultValue={pledge}
                                style={styles.textInput}/>
                            <TouchableOpacity style={styles.button_modal} onPress={onPledgePress}>
                                <CustomText style={styles.buttonText2}>Save & Exit</CustomText>
                                
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {changePledgeOpen(false)}}>
                                <CustomText style={{marginTop: '5%', fontSize: 16, color: '#05532b'}}>Close</CustomText>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </TouchableWithoutFeedback>
            </Modal>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <CustomText style={styles.intro}>Welcome.</CustomText>
                    {pledge !== '' && <CustomText style={styles.desc}>{pledge}</CustomText>}
                    <View style={styles.centeredView}>
                        <TouchableOpacity style={styles.button_other} onPress={() => changePledgeOpen(true)}>
                            <CustomText style={styles.buttonText}>Create or Update Pledge</CustomText>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.centeredView}>
                        <CustomText style={styles.intro_other}>THE FIVE PILLARS:</CustomText>
                        <TouchableOpacity style={styles.button} onPress={() => changeSelfCareOpen(true)}>
                            <CustomText style={styles.buttonText1}>Self Care</CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => changeFinancialSecurityOpen(true)}>
                            <CustomText style={styles.buttonText1}>Financial Stability</CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => changeSupportNetworkOpen(true)}>
                            <CustomText style={styles.buttonText1}>Support Network</CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => changeEmploymentOpen(true)}>
                            <CustomText style={styles.buttonText1}>Employment</CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => changeRecoveryFocusOpen(true)}>
                            <CustomText style={styles.buttonText1}>Recovery Focus</CustomText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: '5%'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',

        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
    },
    intro: {
        fontSize: 40,
        color: '#05532b',
        marginTop: '5%',
        textAlign: 'center',
        fontFamily: 'Poppins_400Regular',
    },
    desc_modal: {
        marginTop: '2%',
        textAlign: 'center',
        marginHorizontal: '10%',
        fontSize: 16,
        color: '#05532b',
        fontFamily: 'Poppins_400Regular',
    },
    desc: {
        marginTop: '2%',
        marginHorizontal: '10%',
        textAlign: 'center',
        fontSize: 18,
        color: '#05532b',
        fontFamily: 'Poppins_400Regular',
    },
    intro_modal: {
        textAlign: 'center',
        fontSize: 30,
        color: '#05532b',
        fontFamily: 'Poppins_400Regular',
    },
    intro_other: {
        marginTop: '10%',
        fontSize: 30,
        color: '#05532b',
        fontFamily: 'Poppins_400Regular',
    },
    textInput: {
        height: '40%',
        textAlignVertical: 'top',
        paddingBottom: '20%',
        width: '80%',
        borderRadius: 10,
        marginTop: '5%',
        fontSize: 16,
        
        padding: '2%',
        backgroundColor: '#f0f1f0',
        fontFamily: 'Poppins_400Regular',
        borderColor: '#d1d1d1',
        borderWidth: 1,
    },
    button: {
        marginTop: '5%',
        width: '75%',
        backgroundColor: '#05532b',
        padding: 22,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        elevation: 5,
        // Add transition effect for buttons
        transition: 'background-color 0.2s ease-in-out',
    },
    button_modal: {
        backgroundColor: '#05532b',
        marginTop: '5%',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        width: '40%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    button_other: {
        width: '60%',
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#05532b',
        marginTop: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        
        // Add transition effect for buttons
        transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
    },
    buttonText: {
        color: '#05532b',
        fontSize: 17,
        textAlign: 'center',
        fontFamily: 'Poppins_400Regular',
    },
    buttonText1: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'Poppins_400Regular',
    },
    buttonText2: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Poppins_400Regular',
    },
    scrollView: {
        height: '100%',
        backgroundColor: '#ffffff',
    },
    content: {
        paddingBottom: '5%',
        justifyContent: 'center',
    },
    centeredView: {
        alignItems: 'center',
    }
});
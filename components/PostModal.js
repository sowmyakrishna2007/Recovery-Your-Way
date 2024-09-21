import {React, useState} from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Modal,
    FlatList,
    DatePickerIOS
} from 'react-native';
import CustomText from '../customText';
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';

import EventDetail from './EventDetails';
import {events} from '../info/events';
import Event from '../info/model';
import DatePicker from 'react-native-date-picker'
import DateTimePicker from '@react-native-community/datetimepicker';
import {SelectList} from 'react-native-dropdown-select-list'
import CalendarPicker from "react-native-calendar-picker";
import storeTask from '../addTask.js'
import { Platform } from 'react-native';
import { useAuth } from '../AuthContext';
import CustomTextInput from '../customTextInput';
export default function EventModal(props) {
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
      });
    const {user} = useAuth()
    function onSave() {
        
        events.push(new Event(description, category, date))
        changeCategory('Choose Category')
        setDate(new Date())
        changeDescription('')
        storeTask(user, {dsc: description, cat: category, d: date, completed:false})
    }
    const [description, changeDescription] = useState('');
    const [category, changeCategory] = useState('')
    const [date, setDate] = useState(new Date())
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState('date')
    
    const onChange = (e, selectedDate) => {
        setDate(selectedDate)
        setShow(false)
    }

    const showMode = (modeToShow) => {
        setShow(true);
        setMode(modeToShow);
    }
    function showAndroid() {
        setShow(true)
    }
    

    return (
        <Modal animationType="slide" visible={props.visible}>
            <ScrollView style={{
                    textAlign: 'center'
                }}>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: 'flex'
                    }}>
                    <CustomText style={styles.intro_modal}>CREATE A POST</CustomText>
                    <CustomTextInput
                        style={styles.TextInput}
                        placeholder='Enter your post here'
                        value={description}
                        autoCapitalize='none'
                        onChangeText={text => changeDescription(text)}
                        placeholderTextColor='gray'/>
                    <View
                        styles={{
                            width: '100%'
                        }}>
                        <SelectList
                            setSelected={(val) => changeCategory(val)}
                            styles={{
                               widht: '100%' 
                            }}
                            data={data}
                            save="value"
                            placeholder='Choose Category'
                            searchPlaceholder='Search'
                            inputStyles={{
                                fontSize: 20,
                                textAlign: 'left',
                                fontFamily: 'Poppins_400Regular',
                                color: 'gray'

                            }}
                            boxStyles={{
                                borderWidth: 0,
                                borderBottomWidth: 2,
                                borderBottomColor: '#05532b',
                                borderRadius: 0,
                                fontFamily: 'Poppins_400Regular'

                    
                            }}
                            dropdownStyles={{
                                borderWidth: 0,
                                fontFamily: 'Poppins_400Regular'

                            }}
                            dropdownItemStyles={{
                                borderWidth: 0,
                                borderBottomWidth: 2,
                                borderBottomColor: '#05532b',
                                fontFamily: 'Poppins_400Regular'

                            }}
                            dropdownTextStyles={{
                                fontSize: 20,
                                textAlign: 'left',
                                padding: 5,
                                fontFamily: 'Poppins_400Regular'

                            }}/>
                    </View>

                    <View
                        style={{
                            marginTop: '5%'
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '35%',
                                alignItems: 'center'
                            }}>
                            <CustomText style={styles.body}>Event Date:</CustomText>

                            <View>
                                {<MyDatePicker/>}</View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.button_modal} onPress={onSave}>
                        <CustomText
                            style={{
                                color: '#fff',
                                fontSize: 20,
                                textAlign: 'center'
                            }}>Save Task</CustomText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button_other} onPress={props.pressed}>
                        <CustomText
                            style={{
                                color: '#05532b',
                                fontSize: 20,
                                textAlign: 'center'
                            }}>Go back</CustomText>
                    </TouchableOpacity>

                </View>

            </ScrollView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    sub: {
        fontSize: 30,
        color: '#05532b'
    },
    intro: {
        marginTop: '5%',
        marginLeft: '10%',
        fontSize: 55,
        color: '#05532b'
    },
    desc_modal: {
        marginTop: '2%',
        textAlign: 'center',
        marginHorizontal: '10%',
        fontSize: 20,
        color: '#05532b'
    },
    desc: {
        marginTop: '5%',

        marginLeft: '10%',
        fontSize: 20,
        color: '#05532b'
    },
    line_modal: {
        textAlign: 'center',
        fontSize: 30,
        color: '#05532b'
    },
    intro_modal: {
        textAlign: 'center',
        marginTop: '40%',
        fontSize: 35,
        color: '#05532b',
        fontWeight: '400'
    },
    task_modal: {
        textAlign: 'center',
        marginTop: '2%',
        fontSize: 35,
        color: '#05532b',
        fontWeight: '400'
    },
    intro_other: {
        marginTop: '10%',
        fontSize: 35,
        color: '#05532b'
    },
    intro_cut: {
        fontSize: 55,
        color: '#05532b'
    },

    title: {
        marginTop: 10,
        marginLeft: 40,
        fontSize: 40,
        color: '#05532b',
        textAlign: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'white'
    },
    title2: {
        fontSize: 30,
        color: 'white'
    },
    body: {
        fontSize: 20,
        color: '#05532b',
        width: '80%',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 15
    },
    TextInput: {
        fontSize: 2,
        color: 'black',
        borderBottomWidth: 2,
        marginTop: 10,
        marginBottom: 10,
        borderColor: 'white',
        width: '60%',
        padding: 12,
        borderRadius: 2,
        borderBottomColor: '#05532b'
    },
    button: {
        marginTop: '5%',
        width: '60%',
        fontSize: 20,
        backgroundColor: '#05532b',
        padding: 15,
        borderRadius: 15,
        textAlign: 'center'
    },
    button_modal: {
        marginBottom: '5%',
        fontSize: 20,
        backgroundColor: '#05532b',
        padding: 15,
        marginTop: '10%',
        borderRadius: 15,
        textAlign: 'center',
        width: '40%'
    },
    button_other: {
        marginTop: '5%',
        width: '40%',
        fontSize: 20,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#05532b'
    }
})
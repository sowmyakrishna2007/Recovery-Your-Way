import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import CustomText from '../customText';
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SelectList } from 'react-native-dropdown-select-list';
import storeTask from '../addTask.js';
import { Platform } from 'react-native';
import { useAuth } from '../AuthContext';
import CustomTextInput from '../customTextInput';
import updateTask from '../updateTask';

export default function EventModal(props) {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });
  const { user } = useAuth();
  const { visible, pressed, currEvent, setCurrEvent } = props;
  const [description, changeDescription] = useState('');
  const [category, changeCategory] = useState('Self Care');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');

  const data = [
    { key: '1', value: 'Self Care' },
    { key: '2', value: 'Financial Stability' },
    { key: '3', value: 'Support Network' },
    { key: '4', value: 'Employment' },
    { key: '5', value: 'Recovery Focus' },
  ];

  useEffect(() => {
    if (currEvent) {
      changeDescription(currEvent.dsc || '');
      changeCategory(currEvent.cat || '');
      setDate(currEvent.d ? new Date(currEvent.d) : new Date());
    }
  }, [currEvent, visible]);

  const onSave = async () => {
    date.setHours(7, 0, 0, 0);
    if (currEvent == null) {
        await storeTask(user, { dsc: description, cat: category, d: date, completed: false });
    } else {
        await updateTask(user, { dsc: description, cat: category, d: date, completed: false }, currEvent);
    }
    setCurrEvent(null)
    pressed();
    changeCategory('Self Care');
    setDate(new Date());
    changeDescription('');
  };

  function goBack()  {
    pressed()
    changeCategory('Self Care');
    setDate(new Date());
    changeDescription('');
  }

  const onChange = (e, selectedDate) => {
    setDate(selectedDate || date);
    setShow(false);
  };

  const showMode = (modeToShow) => {
    setShow(true);
    setMode(modeToShow);
  };

  const MyDatePicker = () => {
    return (
      <View>
        {Platform.OS === 'ios' || show ? (
          <DateTimePicker value={date} mode={mode} is24Hour={true} onChange={onChange} />
        ) : (
          <TouchableOpacity style={{ backgroundColor: '#e0e0e0', padding: 5, borderRadius: 5 }} onPress={() => showMode('date')}>
            <CustomText styles={{ fontSize: 10 }}>{date.toString().slice(4, 15)}</CustomText>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <View style={{width: '90%'}}>
          <ScrollView contentContainerStyle={styles.scrollContainer} >
            { currEvent == null && <CustomText style={styles.intro_modal}>CREATE A TASK</CustomText>}
            {currEvent != null && <CustomText style={styles.intro_modal}>EDIT TASK</CustomText>}
            <CustomTextInput
              style={styles.TextInput}
              multiline={true}
              placeholder="Event Description"
              value={description}
              autoCapitalize="none"
              onChangeText={text => changeDescription(text)}
              placeholderTextColor="gray"
            />
            
            <View style={{ width: '90%' }}>
              <SelectList
                setSelected={val => changeCategory(val)}
                data={data}
                save="value"
                placeholder={category}
                searchPlaceholder="Search"
                inputStyles={styles.selectListInput}
                boxStyles={styles.selectListBox}
                dropdownStyles={styles.selectListDropdown}
                dropdownItemStyles={styles.selectListDropdownItem}
                dropdownTextStyles={styles.selectListDropdownText}
              />
            </View>

            <View style={styles.datePickerContainer}>
              <CustomText style={styles.body}>Event Date: </CustomText>
              <MyDatePicker />
            </View>

            <TouchableOpacity style={styles.button_modal} onPress={onSave}>
              <CustomText style={styles.buttonText}>Save Task</CustomText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={goBack}>
              <CustomText style={styles.closeButtonText}>Go back</CustomText>
            </TouchableOpacity>
          </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  scrollContainer: {
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    color: '#05532b',
    fontSize: 16,
  },
  intro_modal: {
    textAlign: 'center',
    fontSize: 24,
    color: '#05532b',
    fontWeight: '400',
    marginBottom: 20,
  },
  TextInput: {
    width: '90%',
    height: 110,
    fontSize: 16,
    color: 'black',
    borderWidth: 1,
    borderColor: '#05532b',
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    textAlignVertical: 'top',
    backgroundColor: '#f0f1f0',
        borderWidth: 1,
        borderColor: '#d2d2d2'
  },
  selectListInput: {
    fontSize: 16,
    textAlign: 'left',
    fontFamily: 'Poppins_400Regular',
    color: 'black',
  },
  selectListBox: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#05532b',
    borderRadius: 0,
    fontFamily: 'Poppins_400Regular',
  },
  selectListDropdown: {
    borderWidth: 0,
    fontFamily: 'Poppins_400Regular',
  },
  selectListDropdownItem: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#05532b',
    fontFamily: 'Poppins_400Regular',
  },
  selectListDropdownText: {
    fontSize: 16,
    textAlign: 'left',
    padding: 5,
    fontFamily: 'Poppins_400Regular',
  },
  datePickerContainer: {
    marginTop: '5%',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  body: {
    fontSize: 16,
    color: '#05532b',
    textAlign: 'center',
    marginVertical: 10,
  },
  button_modal: {
    marginTop: 18,
    width: '90%',
    fontSize: 18,
    backgroundColor: '#05532b',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  button_other: {
    marginTop: 10,
    width: '100%',
    fontSize: 18,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#05532b',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonOtherText: {
    color: '#05532b',
    fontSize: 18,
    textAlign: 'center',
  },
});
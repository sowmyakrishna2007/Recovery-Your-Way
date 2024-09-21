'#dfeaf7'

import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import CustomText from '../customText';
import { getAuth } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { url } from '../urls';
export default function CompletedDetail(props) {
    const { date, name, category, item, user, onDelete, onComplete } = props;

    async function handleDelete(key) {
      try {
          const id = user.uid;
          const token = await user.getIdToken();
          const response = await axios.delete(
              `${url}/users/${id}/tasks/${key}.json?auth=${token}`
          );
          
          if (response.status === 200) {
              onDelete(); // Call the refetch function passed as a prop
          } else {
              Alert.alert('Error', 'Failed to delete the task. Please try again.');
          }
      } catch (error) {
          Alert.alert('Error', 'An error occurred while deleting the task. Please try again.');
      }
  }

    

    // Function to remove time from a date
    function truncateTime(date) {
        const truncatedDate = new Date(date);
        truncatedDate.setHours(0, 0, 0, 0);
        return truncatedDate;
    }

    // Check if the event date is in the past (ignoring time)
    const isPastEvent = truncateTime(new Date(date)) < truncateTime(new Date());

    return (
        <View style={[styles.container]}>
        <CustomText style={styles.name}>{name}</CustomText>
        <CustomText style={styles.category}>{category}</CustomText>
        <CustomText style={styles.date}>{date.toString().substr(0, 10)}</CustomText>
        <View style={styles.buttonContainer}>
          
          <View style={styles.editDeleteContainer}>
            
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <MaterialIcons name="delete" size={21} color="#921007" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 300,
        borderRadius: 25,
        backgroundColor: '#dfeaf7',
        padding: 20,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      pastContainer: {
        backgroundColor: '#f8d7da',
      },
      name: {
        fontSize: 18,
        color: '#05532b',
      },
      category: {
        fontSize: 17,
        color: '#05532b',
      },
      date: {
        fontSize: 15,
        color: '#05532b',
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
      },
      editDeleteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
});
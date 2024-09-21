import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native'; // Import Alert
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import CustomText from '../customText';
import { MaterialIcons } from '@expo/vector-icons';
import { url } from '../urls';

export default function EventDetail(props) {
  const { date, name, category, item, user, onDelete, onComplete, pressed, onSave, isOpen, setIsOpen, setCurrEvent } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  function handleEdit(item) {
    setIsOpen(true);
    setCurrEvent(item);
  }

  async function cancelNotificationIfExists(notificationId) {
    if (notificationId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      } catch (error) {
        Alert.alert('Error', 'Failed to cancel notification');
      }
    }
  }

  async function handleDelete(key) {
    const id = user.uid;
    const token = await user.getIdToken();

    try {
      // Fetch the task data to get the notificationId
      const taskResponse = await axios.get(
        `${url}/users/${id}/tasks/${key}.json?auth=${token}`
      );
      const { notificationId } = taskResponse.data;

      // Cancel the notification if it exists
      await cancelNotificationIfExists(notificationId);

      // Set notificationId to null in the database
      await axios.patch(
        `${url}/users/${id}/tasks/${key}.json?auth=${token}`,
        { notificationId: null }
      );

      // Delete the task
      const response = await axios.delete(
        `${url}/users/${id}/tasks/${key}.json?auth=${token}`
      );

      if (response.status === 200) {
        onDelete();
      } else {
        throw new Error('Failed to delete the task');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the task');
    }
  }

  async function handleComplete(key) {
    const id = user.uid;
    const token = await user.getIdToken();

    try {
      // Fetch the task data to get the notificationId
      const taskResponse = await axios.get(
        `${url}/users/${id}/tasks/${key}.json?auth=${token}`
      );
      const { notificationId } = taskResponse.data;

      // Cancel the notification if it exists
      await cancelNotificationIfExists(notificationId);

      // Set notificationId to null and mark the task as completed in the database
      const response = await axios.patch(
        `${url}/users/${id}/tasks/${key}.json?auth=${token}`,
        { completed: true, notificationId: null }
      );

      if (response.status === 200) {
        onComplete();
      } else {
        throw new Error('Failed to complete the task');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while completing the task');
    }
  }

  function truncateTime(date) {
    const truncatedDate = new Date(date);
    truncatedDate.setHours(7, 0, 0, 0);

    return truncatedDate;
  }

  const isPastEvent = truncateTime(new Date(date)) < truncateTime(new Date());

  function handleModalClose() {
    setModalVisible(false);
    setEditingItem(null);
  }

  return (
    <View style={[styles.container, isPastEvent && styles.pastContainer]}>
      <CustomText style={styles.name}>{name}</CustomText>
      <CustomText style={styles.category}>{category}</CustomText>
      <CustomText style={styles.date}>{date.toString().substr(0, 10)}</CustomText>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleComplete(item.id)}>
          <MaterialIcons name="check-circle" size={24} color="#008641" />
        </TouchableOpacity>
        <View style={styles.editDeleteContainer}>
          <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={() => handleEdit(item)}>
            <MaterialIcons name="edit" size={21} color="#05532b" />
          </TouchableOpacity>
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
    backgroundColor: '#e1f4ea',
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
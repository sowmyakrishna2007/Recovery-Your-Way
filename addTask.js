import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { url } from './urls';
import { Alert } from 'react-native'; // Import Alert

// Function to check notification permissions
const checkNotificationPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    return false;
  }
  return true;
};

// Function to schedule a notification
const scheduleNotificationHandler = async (taskData) => {
  const targetDate = new Date(taskData.d);
  targetDate.setHours(7, 0, 0, 0); 
  const timeUntilNotification = targetDate.getTime() - new Date().getTime();

  if (timeUntilNotification > 0) { 
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Task Reminder",
          body: taskData.dsc,
        },
        trigger: {
          seconds: timeUntilNotification/1000, 
        },
      });
      return notificationId;
    } catch (error) {
      return null;
    }
  } else {
    return null; 
  }
};

// Function to store a new task and schedule a notification
const storeTask = async (user, taskData) => {
  try {
    const token = await user.getIdToken(true);
    const id = user.uid;


    const response = await axios.post(
      `${url}/users/${id}/tasks.json?auth=${token}`,
      taskData
    );

    const permissionsGranted = await checkNotificationPermissions();
    if (permissionsGranted) {
      const notificationId = await scheduleNotificationHandler(taskData);

      if (notificationId) {
        const taskId = response.data.name; 
        await axios.patch(
          `${url}/users/${id}/tasks/${taskId}.json?auth=${token}`,
          { notificationId }
        );
      }
    } 
  } catch (error) {
    Alert.alert('Error', `Error storing task`); 
  }
};

export default storeTask;

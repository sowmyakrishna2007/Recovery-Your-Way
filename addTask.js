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
  targetDate.setHours(7, 0, 0, 0); // Ensure the time is set to 7:00:00 AM
  const timeUntilNotification = targetDate.getTime() - new Date().getTime();

  if (timeUntilNotification > 0) { // Ensure notification is scheduled only if the target date is in the future
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Task Reminder",
          body: taskData.dsc,
        },
        trigger: {
          seconds: timeUntilNotification/1000, // Convert milliseconds to seconds
        },
      });
      return notificationId;
    } catch (error) {
      return null;
    }
  } else {
    return null; // Do not schedule a notification if the target date is in the past
  }
};

// Function to store a new task and schedule a notification
const storeTask = async (user, taskData) => {
  try {
    const token = await user.getIdToken(true);
    const id = user.uid;

    // Store task in the database
    const response = await axios.post(
      `${url}/users/${id}/tasks.json?auth=${token}`,
      taskData
    );

    // Check if notifications are permitted
    const permissionsGranted = await checkNotificationPermissions();
    if (permissionsGranted) {
      // Schedule notification and get its ID, only if the task's date is in the future
      const notificationId = await scheduleNotificationHandler(taskData);

      // Update the task with the notification ID
      if (notificationId) {
        const taskId = response.data.name; // Get the ID of the newly created task
        await axios.patch(
          `${url}/users/${id}/tasks/${taskId}.json?auth=${token}`,
          { notificationId }
        );
      }
    } 
  } catch (error) {
    Alert.alert('Error', `Error storing task`); // Use Alert for error
  }
};

export default storeTask;
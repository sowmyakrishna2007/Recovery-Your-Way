import axios from 'axios';
import * as Notifications from 'expo-notifications';
import { url } from './urls';
import { Alert } from 'react-native'; // Import Alert

// Function to cancel a notification
async function cancelNotification(notificationId) {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    Alert.alert('Error', `Error canceling notification: ${error.message}`); // Use Alert for error
  }
}

// Function to schedule a notification
async function scheduleNotification(taskData) {
  const targetDate = new Date(taskData.d);
  targetDate.setHours(7);
  targetDate.setMinutes(0);
  targetDate.setSeconds(0);
  const timeUntilNotification = targetDate.getTime() - new Date().getTime();

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Task Reminder",
        body: taskData.dsc,
      },
      trigger: {
        seconds: timeUntilNotification/1000, // Notification after 3 seconds for testing
      },
    });
    return notificationId;
  } catch (error) {
    return null;
  }
}

// Function to update a task and manage notifications
const updateTask = async (user, taskData, event) => {
  try {
    const token = await user.getIdToken(true);
    const id = user.uid;

    // Cancel existing notification if it exists
    if (event.notificationId) {
      await cancelNotification(event.notificationId);
    }

    // Update the task
    const response = await axios.patch(
      `${url}/users/${id}/tasks/${event.id}.json?auth=${token}`,
      taskData
    );

    // Schedule a new notification
    const newNotificationId = await scheduleNotification(taskData);

    // Update the task with the new notification ID
    if (newNotificationId) {
      await axios.patch(
        `${url}/users/${id}/tasks/${event.id}.json?auth=${token}`,
        { notificationId: newNotificationId }
      );
    }
  } catch (error) {
    Alert.alert('Error', `Error updating task`); // Use Alert for error
  }
};

export default updateTask;
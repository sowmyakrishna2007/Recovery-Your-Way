import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import CustomText from '../customText';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import CompletedDetail from '../components/CompletedDetails';
import EventModal from '../components/EventModal';
import { getAuth } from 'firebase/auth';
import { useAuth } from '../AuthContext';
import { url } from '../urls';

// Function to fetch events from Firebase Realtime Database
const fetchEvents = async (user) => {
  try {
    const token = await user.getIdToken();
    const id = user.uid;
    const response = await fetch(
      `${url}/users/${id}/tasks.json?auth=${token}`
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    if (data) {
      const eventsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      return eventsArray;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export default function CompletedTasks() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState([]); // State to store fetched events

  const fetchData = async () => {
    try {
      const data = await fetchEvents(user);
      const completedTasks = data.filter(task => task.completed); // Filter completed tasks
      setEvents(completedTasks);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial data fetching when component mounts
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData(); // Data fetching when the screen comes into focus
    }, [])
  );

  const pressed = async (taskData) => {
    setIsOpen(false);
    // Add logic to store the taskData to your Firebase DB or wherever necessary
    // Then, refetch the events
    await fetchData();
  };

  const open = () => {
    setIsOpen(true);
  };

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <View style={{ alignItems: 'center', marginTop: '5%' }}>

        <FlatList
          scrollEnabled={false}
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CompletedDetail
              user={user}
              item={item}
              name={item.dsc}
              category={item.cat}
              date={item.d ? item.d.toString() : 'No date'} // Handle null date
              key={item.id}
              onDelete={fetchData} // Pass the refetch function as a prop
              onComplete={fetchData}
            />
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button_modal: {
    marginBottom: '5%',
    fontSize: 20,
    backgroundColor: '#05532b',
    padding: 15,
    borderRadius: 15,
    textAlign: 'center',
    width: '40%',
  },
});
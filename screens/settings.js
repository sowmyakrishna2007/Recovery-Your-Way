import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import CustomText from '../customText';
import { useFocusEffect } from '@react-navigation/native';
import EventDetail from '../components/EventDetails';
import EventModal from '../components/EventModal';
import { useAuth } from '../AuthContext';
import { url } from '../urls';
import EventDetailsOther from '../components/EventDetailsOther';
// Function to fetch events from Firebase Realtime Database
const fetchEvents = async (user) => {
  try {
    const token = await user.getIdToken();
    const id = user.uid;
    const response = await fetch(url + '/users/'+id+'/tasks.json?auth=' + token);

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

export default function Settings() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState([]); // State to store fetched events
  const [currEvent, setCurrEvent] = useState(null)

  const fetchData = async () => {
    try {
      const data = await fetchEvents(user);
      const completedTasks = data.filter(task => !task.completed); // Filter completed tasks
      setEvents(completedTasks); // Update state with new events
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

  const pressed = async () => {
    await fetchData(); // Refetch events
    setIsOpen(false); // Close the modal
    if (currEvent != null) {
      setCurrEvent(null)
    }
  };

  const open = () => {
    setIsOpen(true);
    
  };

  return (
    <ScrollView style={{ backgroundColor: '#fff' }} scrollIndicatorInsets={{ right: 1 }}>
      <EventModal visible={isOpen} pressed={pressed} currEvent={currEvent} setCurrEvent={setCurrEvent}/>
      <View style={{ alignItems: 'center', marginTop: '5%' }}>
        <TouchableOpacity style={styles.button_modal} onPress={open}>
          
              {<CustomText style={{ color: '#fff', fontSize: 20, textAlign: 'center' }}>ADD TASK</CustomText>}
            
          
        </TouchableOpacity>
        <FlatList
          scrollEnabled={false}
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventDetail
              setCurrEvent={setCurrEvent}
              currEvent={currEvent}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              pressed={pressed}
              user={user}
              item={item}
              name={item.dsc}
              category={item.cat}
              date={item.d ? item.d : 'No date'} // Handle null date
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
    shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 5,
  },
});
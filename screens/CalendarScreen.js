import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Dimensions, Alert, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import EventDetail from '../components/EventDetails';
import CustomText from '../customText';
import EventDetailsOther from '../components/EventDetailsOther';
import { url } from '../urls';
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
      const finalTasks = eventsArray.filter(task => !task.completed);
      return finalTasks;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export default function CalendarScreen() {
  
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchData = async () => {
    try {
      const data = await fetchEvents(user);
      setEvents(data);

      const marked = {};
      data.forEach(event => {
        if (event.d) {
          const date = event.d.split('T')[0];
          marked[date] = { marked: true, dotColor: '#05532b' }; // Dark green color for marked events
        }
      });
      setMarkedDates(marked);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData(); // Refresh data when screen gains focus
    }, [])
  );

  const handleDayPress = (day) => {
    const date = day.dateString;
    setSelectedDate(date);
  };

  // Filter events for the selected date
  const filteredEvents = events.filter(event => event.d && event.d.split('T')[0] === selectedDate);
  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <Calendar
          style={styles.calendar}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          theme={{
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#000000',
            selectedDayBackgroundColor: '#05532b',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#05532b',
            dayTextColor: '#000000',
            textDisabledColor: '#d9e1e8',
            dotColor: '#05532b',
            selectedDotColor: '#ffffff',
            arrowColor: 'black',
            monthTextColor: '#05532b',
            textDayFontFamily: 'Poppins_400Regular',
            textMonthFontFamily: 'Poppins_400Regular',
            textDayHeaderFontFamily: 'Poppins_400Regular',
            textDayFontWeight: '500',
            textDayHeaderFontWeight: '500',
            textDayFontSize: 16,
            textMonthFontSize: 21,
            textDayHeaderFontSize: 14,
          }}
        />
        {
            selectedDate && (
                <View style={styles.eventDetails}>
            <CustomText style={styles.eventsHeader}>Events on {selectedDate}:</CustomText>
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <EventDetailsOther
                user={user}
              item={event}
              name={event.dsc}
              category={event.cat}
              date={event.d ? event.d.toString() : 'No date'} // Handle null date
              key={event.id}
              onDelete={fetchData} // Pass the refetch function as a prop
              onComplete={fetchData}
                />
              ))
            ) : (
              <CustomText style={styles.noEventsText}>No events on this day.</CustomText>
            )}
          </View>
            )
        }
          
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  calendar: {
    width: Dimensions.get('window').width*0.9,
  },
  eventDetails: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  eventsHeader: {
    fontSize: 20,
    color: '#05532b',
  },
  noEventsText: {
    fontSize: 16,
    color: 'black',
    marginTop: '5px'
  },
  event: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#e1f4ea',
    width: '90%',
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#05532b',
  },
  eventCategory: {
    fontSize: 16,
    color: '#05532b',
  },
  eventDate: {
    fontSize: 14,
    color: '#555',
  },
});


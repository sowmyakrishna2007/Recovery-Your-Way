import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, FlatList, ScrollView, Dimensions } from 'react-native';
import CustomText from '../customText';
import axios from 'axios';
import EventDetail from './EventDetails';
import { getAuth } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import { url } from '../urls';
import EventDetailsOther from './EventDetailsOther';
export default function PillarModal(props) {
    const [events, setEvents] = useState([]);
    const [completedEvents, setCompletedEvents] = useState([]);
    const [completedFilteredEvents, setCompletedFilteredEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const { user } = useAuth();

    const fetchEvents = async () => {
        try {
            const id = user.uid;
            const token = await user.getIdToken();
            const response = await fetch(url + '/users/' + id + '/tasks.json?auth=' + token);
            const eventData = await response.json();
            if (eventData) {
                const eventsArray = Object.keys(eventData).map(key => ({ id: key, ...eventData[key] }));
                const tasks = eventsArray.filter(task => !task.completed); // Filter completed tasks
                const completed = eventsArray.filter(task => task.completed);
                setEvents(tasks);
                setCompletedEvents(completed);
            } else {
                setEvents([]);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const filterEvents = () => {
        const filtered = events.filter(event => event.cat === props.category);
        setFilteredEvents(filtered);
        const compfiltered = completedEvents.filter(event => event.cat === props.category);
        setCompletedFilteredEvents(compfiltered);
    };

    useEffect(() => {
        filterEvents();
    }, [events, completedEvents]);

    useFocusEffect(
        useCallback(() => {
            fetchEvents();
        }, [])
    );

    return (
        <Modal
            animationType="fade"
            visible={props.open}
            transparent={true}
            style={{alignItems: 'center'}}
            onRequestClose={props.pressed} // Optional: Handle back button press
        >
            <View style={styles.modalOverlay}>
                <View style={{maxHeight: '70%', width: '95%'}}>
                    
                    <View style={styles.modalContent}>
                    <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                        <CustomText style={styles.intro_modal}>{props.title}</CustomText>
                        {completedFilteredEvents.length > 1 && <CustomText style={styles.comp_modal}>You have completed {completedFilteredEvents.length} tasks in this category!</CustomText>}
                        {completedFilteredEvents.length == 1 && <CustomText style={styles.comp_modal}>You have completed {completedFilteredEvents.length} task in this category!</CustomText>}
                        <CustomText style={styles.desc_modal}>{props.desc}</CustomText>
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity style={styles.button_modal} onPress={props.pressed}>
                                <CustomText style={styles.buttonText}>Go Back</CustomText>
                            </TouchableOpacity>
                            <CustomText style={styles.task_modal}>UPCOMING TASKS</CustomText>
                            <FlatList
                            contentContainerStyle={{alignItems: 'center'}}
                            
                                scrollEnabled={false}
                                data={filteredEvents}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <EventDetailsOther

                                        user={user}
                                        item={item}
                                        name={item.dsc}
                                        category={item.cat}
                                        date={item.d}
                                        key={item.id}
                                        onDelete={fetchEvents}
                                        onComplete={fetchEvents}
                                    />
                                )}
                            />
                        </View>
                        </ScrollView>
                        </View>
                    
                    </View>
            </View>
        </Modal>
    );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Add a semi-transparent background
    },
    modalContent: {
        marginVertical: 20,      
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        justifyContent: 'center',
    },
    scrollView: {
        
    },
    intro_modal: {
        textAlign: 'center',
        fontSize: 30,
        color: '#05532b',
        fontWeight: '400',
    },
    task_modal: {
        textAlign: 'center',
        marginTop: '2%',
        fontSize: 27,
        color: '#05532b',
        fontWeight: '400',
    },
    desc_modal: {
        marginTop: '2%',
        textAlign: 'center',
        marginHorizontal: '10%',
        fontSize: 16,
        color: '#05532b',
    },
    comp_modal: {
        marginTop: '2%',
        textAlign: 'center',
        marginHorizontal: '10%',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#05532b',
    },
    button_modal: {
        marginVertical: '5%',
        fontSize: 16,
        backgroundColor: '#05532b',
        padding: 15,
        borderRadius: 15,
        textAlign: 'center',
        width: '40%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

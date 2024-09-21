import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, Text, Alert } from 'react-native';
import CustomText from '../customText';
import CustomTextInput from '../customTextInput';
import { useFocusEffect } from '@react-navigation/native';
import PostDetail from '../components/PostDetails';
import storePost from '../addPost';
import { useAuth } from '../AuthContext';
import { url } from '../urls';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Function to fetch posts from Firebase Realtime Database
const fetchAllPosts = async (user) => {
    try {
        const token = await user.getIdToken(true);
        const response = await fetch(`${url}/posts.json?auth=${token}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data) {
            return Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse();
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        throw error;
    }
};

export default function Forum() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]); // State to store fetched posts
    const [post, setPost] = useState('');
    const [loading, setLoading] = useState(true); // State to handle loading
    const [error, setError] = useState(null); // State to handle errors

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAllPosts(user);
            setPosts(data);
        } catch (error) {
            setError('Failed to fetch posts');
        } finally {
            setLoading(false);
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

    const onSave = async () => {
        try {
            await storePost(user, post);
            await fetchData()
            setPost('')
        } catch (error) {
            console.error('Failed to save post:', error.message);
            // Optionally rollback the UI update here if needed
        }
    };

    const handleDelete = async (postId) => {
        try {
            const token = await user.getIdToken(true);
            const response = await fetch(`${url}/posts/${postId}.json?auth=${token}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                Alert.alert("Error", "Error deleting post.")
            }
            // Remove the deleted post from local state
            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        } catch (error) {
            Alert.alert("Error", "Error deleting post.")
        }
    };

    const handleEdit = async (post, id) => {
        try {
            const token = await user.getIdToken(true);
            const response = await axios.patch(`${url}/posts/${id}.json?auth=${token}`, 
                {post: post}
                
            );
            if (response.status != 200) {
                Alert.alert("Error", "Error editing post.")
            }
            await fetchData()
            // Remove the deleted post from local state
            
        } catch (error) {
            Alert.alert("Error", "Error editing post.")
        }
    }

    return (
        <KeyboardAwareScrollView style={{ backgroundColor: '#fff' }} scrollIndicatorInsets={{ right: 1 }}>
            <View style={{ alignItems: 'center', marginTop: '5%' }}>
                <CustomTextInput
                    multiline={true}
                    style={styles.textInput}
                    onChangeText={text => setPost(text)}
                    value={post}
                />
                <TouchableOpacity style={styles.button} onPress={onSave}>
                    <CustomText style={styles.buttonText1}>Post</CustomText>
                </TouchableOpacity>
                
                
                    <View style={{width: '90%', marginTop: '5%'}}>
                        <FlatList
                        scrollEnabled={false}
                        data={posts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <PostDetail
                                user={user}
                                postData={item}
                                onDelete={handleDelete} // Pass the handleDelete function
                                key={item.id}
                                onEdit={handleEdit}
                            />
                        )}
                    />
                    </View>
                    
            
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    textInput: {
        height: 100, // Adjust height based on your design
        textAlignVertical: 'top',
        width: '82%',
        borderRadius: 10,
        marginTop: '5%',
        fontSize: 16,
        padding: '2%',
        backgroundColor: '#f0f1f0',
        borderWidth: 1,
        borderColor: '#d0d0d0'
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20
    },
    button: {
        marginTop: '5%',
        width: '82%',
        backgroundColor: '#05532b',
        padding: 12,
        borderRadius: 15,
        textAlign: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText1: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center'
    }
});

import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { url } from './urls';
import { Alert } from 'react-native'; // Import Alert

export default storePost = async (user, post) => {
  try {
    const token = await user.getIdToken(true);
    const userId = user.uid;
    // Generate a unique ID for the post
    const postId = new Date().toISOString();

    // Post data to store
    const postData = {
      username: user.displayName,
      userId: userId,
      post: post,
      timestamp: postId, // Use timestamp as unique ID
    };

    // Store post in user's personal node
    await axios.post(`${url}/users/${userId}/posts.json?auth=${token}`, postData);

    // Optionally store post in publicPosts node if it's public
    await axios.post(`${url}/posts.json?auth=${token}`, postData);

  } catch (error) {
    Alert.alert('Error', `Error storing post`); // Use Alert for error
  }
};

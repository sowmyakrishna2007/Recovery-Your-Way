import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { url } from './urls';
import { Alert } from 'react-native'; 

export default storePost = async (user, post) => {
  try {
    const token = await user.getIdToken(true);
    const userId = user.uid;
    const postId = new Date().toISOString();

    const postData = {
      username: user.displayName,
      userId: userId,
      post: post,
      timestamp: postId, 
    };

    await axios.post(`${url}/users/${userId}/posts.json?auth=${token}`, postData);

    await axios.post(`${url}/posts.json?auth=${token}`, postData);

  } catch (error) {
    Alert.alert('Error', `Error storing post`); 
  }
};

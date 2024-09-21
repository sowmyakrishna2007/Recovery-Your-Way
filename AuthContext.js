import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Import the auth instance
import { Alert } from 'react-native';
import axios from 'axios';
import { url } from './urls';
// Create the context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if auth is defined
    if (!auth) {
      console.error('Auth instance is not available');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return userCredential.user;
    } catch (error) {
      let message = "There was an error logging in. Please try again.";
      if (error.code == 'auth/invalid-credential') {
        message = "The username or password you entered is incorrect.";
      }
      Alert.alert("Login Error", message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout Error:', error.message);
      throw error;
    }
  };

  const deleteAccount = async () => {
    
    if (user) {
      Alert.alert(
        'Delete Account',
        'Are you sure you want to delete your account? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              try {
                const token = await user.getIdToken();
                const id = await user.uid
                
                await axios.delete(`${url}/users/${id}.json?auth=${token}`)
                
                const response = await fetch(url + '/posts.json?auth='+token);
                
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (data) {
                  const eventsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                  for (let i = eventsArray.length-1; i >= 0; i--) {
                    const postId = eventsArray[i].id
                    if (eventsArray[i].userId == id) {
                      
                      await axios.delete(`${url}/posts/${postId}.json?auth=${token}`)
                      
                    } else {
                      const response = await fetch(url + '/posts/' + postId + '/comments.json?auth='+token);
                
                      if (!response.ok) {
                        throw new Error('Network response was not ok');
                      }
                      const data = await response.json();
                      if (data) {
                        const comments = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                        for (let i = comments.length-1; i >= 0; i--) {
                          if (comments[i].userId == id) {
                            const commentId = comments[i].id
                            await axios.delete(`${url}/posts/${postId}/comments/${commentId}.json?auth=${token}`)
                          }
                        }

                      }
                    }
                  }
                }
                await deleteUser(user);
                Alert.alert('Account Deleted', 'Your account has been deleted.');

              } catch (error) {
              
                      Alert.alert('Your account could not be deleted', "Try signing in to your account again to successfully delete it.");
                print(error.message)
              }
            },
          },
        ],
        { cancelable: false }
      );   
  };
  }

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Password Reset email has been sent!", "Did not get an email? Make sure you have an account with the given email address.")
    } catch (error) {
      Alert.alert("Reset Password Error", "Password Reset email could not be sent")
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    resetPassword,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
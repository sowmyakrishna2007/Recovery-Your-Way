import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Modal,
    FlatList,
    Text,
    Keyboard,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import CustomText from '../customText';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { url } from '../urls';
import CustomTextInput from '../customTextInput';
import CommentDetails from './CommentDetails';

export default function PostDetail(props) {
    const { user, postData, onDelete, onEdit, item } = props;
    const [likes, setLikes] = useState(postData.likes || 0);
    const [liked, setLiked] = useState(postData.likedBy && postData.likedBy[user.uid]);
    const [isCommentsOpen, setCommentsOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [isEditing, setIsEditing] = useState(false); 
    const [post, setPost] = useState('');
    const [editingComment1, setEditingComment1] = useState('');
    const [isEditingC, setIsEditingC] = useState(false); 
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const screenHeight = Dimensions.get('window').height;
    const [isEditingComment, setIsEditingComment] = useState(false);

    // Function to fetch comments for the specific post
    const getComments = async () => {
        setLoadingComments(true);
        const token = await user.getIdToken(true);
        try {
            const response = await fetch(`${url}/posts/${postData.id}/comments.json?auth=${token}`);
            if (!response.ok) {
                Alert.alert("Error", "Error fetching comments.")
            }
            const data = await response.json();
            setComments(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse() : []);
        } catch (error) {
            Alert.alert("Error", "Error fetching comments.")
        } finally {
            setLoadingComments(false);
        }
    };

    // Function to post a new comment
    const postComment = async () => {
        if (!comment.trim()) return; // Prevent empty comments
        const token = await user.getIdToken(true);
        const commentData = {
            username: user.displayName,
            userId: user.uid,
            comment: comment,
            timestamp: new Date().toISOString(),
        };
        try {
            await axios.post(`${url}/posts/${postData.id}/comments.json?auth=${token}`, commentData);
            setComment('');
            await getComments(); // Refresh comments after posting
        } catch (error) {
            Alert.alert("Error", "Error posting comment.")
        }
    };

    // Function to handle opening the comments modal
    const handleComments = () => {
        setCommentsOpen(true);
        getComments(); // Fetch comments when the modal opens
    };

    const handleDelete = async (item) => {
        try {
            const token = await user.getIdToken(true);
            await axios.delete(`${url}/posts/${postData.id}/comments/${item.id}.json?auth=${token}`);
            await getComments();
        } catch (error) {
            console.error('Error', "Error deleting comment.");
        }
    };

    const handleEdit = async (comment, item) => {
        setIsEditing(false)
        const token = await user.getIdToken(true);
        await axios.patch(`${url}/posts/${postData.id}/comments/${item.id}.json?auth=${token}`, {
            comment: comment
        });
        await getComments();
    }

    // Function to handle liking the post
    const handleLike = async () => {
        const token = await user.getIdToken(true);
        const postId = postData.id;
        const userId = user.uid;

        const updatedLikes = liked ? likes - 1 : likes + 1;
        setLikes(updatedLikes);
        setLiked(!liked);

        try {
            await axios.patch(
                `${url}/posts/${postId}.json?auth=${token}`,
                {
                    likes: updatedLikes,
                    [`likedBy/${userId}`]: !liked
                }
            );
        } catch (error) {
            console.error('Error updating likes:', error.message);
            setLikes(likes); // Revert likes count on error
            setLiked(liked); // Revert liked status on error
        }
    };

    const isPostOwner = user.uid === postData.userId;

  

    return (
        <>
            {isCommentsOpen && (
                <Modal
                transparent={true}
                animationType="fade"
                visible={isCommentsOpen}
                onRequestClose={() => setCommentsOpen(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modalContent}>
                        <CustomText style={styles.modalTitle}>Comments</CustomText>
                        {!isEditingComment && (
                            <>
                                <CustomTextInput
                                    multiline={true}
                                    style={[styles.textInput, { textAlignVertical: 'top' }]}
                                    onChangeText={text => setComment(text)}
                                    defaultValue={comment}
                                    placeholder="Add a comment..."
                                />
                                <TouchableOpacity style={styles.button2} onPress={postComment}>
                                    <CustomText style={styles.buttonText2}>Comment</CustomText>
                                </TouchableOpacity>
                            </>
                        )}
                        {!isEditingComment && <FlatList
                            data={comments}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={true}
                            style={{width: '100%'}}
                            renderItem={({ item }) => (
                                <CommentDetails
                                    isEditingC={isEditingC}
                                    setIsEditingC={setIsEditingC}
                                    setEditingComment1={setEditingComment1}
                                    editingComment1={editingComment1}
                                    user={user}
                                    comment={item.comment}
                                    id={item.userId}
                                    item={item}
                                    handleDelete={handleDelete}
                                    handleEdit={handleEdit}
                                    isEditingComment={isEditingComment}
                                    setIsEditingComment={setIsEditingComment}

                                />
                            )}
                        />}
                        {isEditingComment && (
    <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        style={{ width: '100%' }}
        renderItem={({ item }) => (
            item.comment == editingComment1 ? (
                <CommentDetails
                    isEditingC={isEditingC}
                    setIsEditingC={setIsEditingC}
                    setEditingComment1={setEditingComment1}
                    editingComment1={editingComment1}
                    user={user}
                    comment={item.comment}
                    id={item.userId}
                    item={item}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    isEditingComment={isEditingComment}
                    setIsEditingComment={setIsEditingComment}
                />
            ) : null
        )}
    />
)}
                        <TouchableOpacity onPress={() => setCommentsOpen(false)} style={styles.closeButton}>
                            <CustomText style={styles.closeButtonText}>Close</CustomText>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        
            )}
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.nameContainer}>
                        <MaterialIcons name="person" size={24} color="#05532b" />
                        <CustomText style={styles.name}>{postData.username}</CustomText>
                    </View>
                    {isPostOwner && (
                        <View style={styles.editDeleteContainer}>
                            <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={() => {
                                if (!isEditing) {
                                    setIsEditing(true);
                                    setPost(postData);
                                } else {
                                    setIsEditing(false);
                                    setPost('');
                                }
                            }}>
                                <MaterialIcons name="edit" size={21} color="#05532b" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onDelete(postData.id)}>
                                <MaterialIcons name="delete" size={21} color="#921007" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                {isEditing && <CustomTextInput multiline={true} style={styles.textInput1} defaultValue={postData.post} onChangeText={text => setPost(text)} />}
                {!isEditing && <CustomText style={styles.post}>{postData.post}</CustomText>}
                {isEditing && <TouchableOpacity style={styles.button3} onPress={() => { onEdit(post, postData.id); setIsEditing(false); }}>
                    <CustomText style={styles.buttonText2}>Save</CustomText>
                </TouchableOpacity>}
                <View style={styles.likeContainer}>
                    <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
                        <MaterialIcons
                            name={liked ? "favorite" : "favorite-border"}
                            size={24}
                            color={liked ? '#921007' : "#888"}
                        />
                        <CustomText style={styles.likesCount}>{likes}</CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleComments} style={styles.commentButton}>
                        <MaterialIcons name="comment" size={24} color="#888" />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        borderRadius: 10,
        backgroundColor: '#f3f1f1',
        padding: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 5,
        alignSelf: 'center'
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#05532b',
        borderBottomWidth: 1,
        paddingBottom: 5
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '70%'
    },
    name: {
        fontSize: 16,
        color: '#05532b',
        marginLeft: 8,
    },
    post: {
        fontSize: 15,
        color: '#05532b',
        marginTop: 10,
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        justifyContent: 'space-between',
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentButton: {
        marginLeft: 20,
    },
    likesCount: {
        fontSize: 18,
        marginLeft: 5,
        color: '#888',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '85%',
        maxHeight: '60%',
        justifyContent:'center',
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        color: '#05532b',
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 5,
    },
    closeButtonText: {
        color: '#05532b',
        fontSize: 14,
    },
    textInput: {
        height: 100,
        width: '95%',
        borderRadius: 10,
        marginTop: 10,
        fontSize: 14,
        padding: '2%',
        backgroundColor: '#f0f1f0',
        borderWidth: 1,
        borderColor: '#d2d2d2',
        textAlignVertical: 'top',
    },
    textInput1: {
        height: 100,
        width: '100%',
        borderRadius: 10,
        marginTop: 10,
        fontSize: 14,
        padding: '2%',
        backgroundColor: '#e1e1e1',
        borderWidth: 1,
        borderColor: '#bcbcbc',
        textAlignVertical: 'top',
    },
    button2: {
        marginTop: '5%',
        width: '95%',
        backgroundColor: '#05532b',
        padding: 14,
        borderRadius: 15,
        textAlign: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        alignSelf: 'center'
    },
    button3: {
        marginTop: '5%',
        width: '100%',
        backgroundColor: '#05532b',
        padding: 14,
        borderRadius: 15,
        textAlign: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        alignSelf: 'center'
    },
    buttonText2: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center'
    },
    editDeleteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';
import CustomText from '../customText';
import { MaterialIcons } from '@expo/vector-icons';
import CustomTextInput from '../customTextInput';

export default function CommentDetails(props) {
    const { user, item, comment, handleDelete, handleEdit,isEditingComment, setIsEditingComment, isEditing, setIsEditing, setEditingComment1, editingComment1 } = props;
    const [editingComment, setEditingComment] = useState(comment);

    return (
        <View style={styles.commentContainer}>
            <View style={styles.nameAndDeleteContainer}>
                <View style={styles.nameContainer}>
                    <MaterialIcons name="person" size={24} color="#05532b" />
                    <CustomText style={styles.username}>{item.username}</CustomText>
                </View>
                {user.uid === item.userId && (
                    <View style={styles.editDeleteContainer}>
                        <TouchableOpacity style={styles.iconButton} onPress={() => {
                            if (isEditingComment) {
                                setIsEditingComment(false);
                                setEditingComment('');
                                setEditingComment1('')
                            } else {
                                setIsEditingComment(true);
                                setEditingComment(comment);
                                setEditingComment1(comment)
                            }
                        }}>
                            <MaterialIcons name="edit" size={19} color="#05532b" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(item)}>
                            <MaterialIcons name="delete" size={19} color="#921007" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            {!isEditingComment ? (
                <CustomText style={styles.commentText}>{comment}</CustomText>
            ) : (
                <>
                    <CustomTextInput
                        multiline={true}
                        defaultValue={comment}
                        style={styles.textInput}
                        onChangeText={(text) => setEditingComment(text)}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={() => {
                        handleEdit(editingComment, item);
                        setIsEditingComment(false);
                    }}>
                        <CustomText style={styles.buttonText}>Save</CustomText>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    commentContainer: {
        width: '95%',
        borderRadius: 10,
        backgroundColor: '#f3f1f1',
        padding: 10,
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        alignSelf: 'center'
    },
    nameAndDeleteContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        borderBottomColor: '#05532b',
        borderBottomWidth: 1,
        paddingBottom: 7,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '75%'
    },
    username: {
        fontSize: 15,
        color: '#05532b',
        marginLeft: 8
    },
    editDeleteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5
    },
    iconButton: {
        paddingHorizontal: 5
    },
    commentText: {
        fontSize: 14,
        color: '#05532b',
        paddingTop: 10
    },
    textInput: {
        height: 100,
        width: '100%',
        borderRadius: 10,
        marginTop: 10,
        fontSize: 14,
        padding: '2%',
        paddingBottom:'15%',
        backgroundColor: '#e1e1e1',
        borderWidth: 1,
        borderColor: '#bcbcbc',
        textAlignVertical: 'top',
    },
    saveButton: {
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
    buttonText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center'
    }
});

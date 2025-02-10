import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useAuth } from './AuthContext';
import CustomText from './customText';

function CustomDrawerContent(props) {
    const { logout, deleteAccount } = useAuth();
    
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <DrawerItemList {...props} />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={logout}>
                        <CustomText style={styles.buttonText}>Sign Out</CustomText>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.footerContainer}>
                <TouchableOpacity onPress={deleteAccount}>
                    <CustomText style={styles.deleteText}>Delete Account</CustomText>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    button: {
        marginTop: 15,
        backgroundColor: '#05532b',
        paddingVertical: 13,
        borderRadius: 15,
        textAlign: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
    },
    footerContainer: {
        paddingHorizontal: 20,
        paddingBottom: 50,
       
        alignItems: 'left', 
    },
    deleteText: {
        color: "#921007",
        fontSize: 15,
    },
});

export default CustomDrawerContent;

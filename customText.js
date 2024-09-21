import React from 'react';
import { Text, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import {Poppins_400Regular } from '@expo-google-fonts/poppins';



const CustomText = ({ style, children, ...props }) => {
    
  return <Text style={[{ fontFamily: 'Poppins_400Regular' }, style]} {...props}>{children}</Text>;
};
const CustomTextInput = ({ style, ...props }) => {
  return (
    <TextInput
      style={[{fontFamily: 'Poppins_400Regular'}, style]}
      {...props}
    />
  );
};

export default CustomText;


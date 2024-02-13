import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import {
  Input,
  Icon,
  Stack,
  Pressable,
  Center,
  NativeBaseProvider,
  Button,
  Box,
  HStack,
  Image,
  VStack,
  Alert,
  IconButton,
  CloseIcon,
  Spinner,
  Heading,
  Collapse,
  useToast,
  PresenceTransition
} from "native-base";
import {  getAuth, auth, getFirestore, collection, addDoc, doc, setDoc, getDoc, query, where, onSnapshot, } from './firebasecontrol'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { MaterialIcons } from "@expo/vector-icons";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './components/LoginPage';
import SMTP from './components/SMTP';
import Checkpoint from './components/Checkpoint';
import './styles.css';
const StackNavigator = createNativeStackNavigator();

const { width, height } = Dimensions.get('window');
const windowWidth = Dimensions.get('window').width;



export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged)

    return subscriber;
  }, []) 

  if (initializing) {
    return null; // or a loading screen if needed
  }

  return (
    <NativeBaseProvider>
      {/* <LoginPage/> */}
      <NavigationContainer>
        <StackNavigator.Navigator options={{headerShown: false}}>
          <StackNavigator.Screen options={{ headerShown: false }} name="Login" component={LoginPage} />          
          <StackNavigator.Screen options={{ headerShown: false }} name="Checkpoint" component={Checkpoint} />
          <StackNavigator.Screen options={{ headerShown: false }} name="SMTP" component={SMTP} />    
          {/* {user ? (<StackNavigator.Screen options={{ headerShown: false }} name="Checkpoint" component={Checkpoint} /> ) : user ?
          (<StackNavigator.Screen options={{ headerShown: false }} name="superadmin" component={SuperAdmin} />) : user ?
          (<StackNavigator.Screen options={{ headerShown: false }} name="admin" component={Admin} />) :  (
          <StackNavigator.Screen  options={{ headerShown: false }} name="Login" component={LoginPage} />
        )} */}
        </StackNavigator.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}



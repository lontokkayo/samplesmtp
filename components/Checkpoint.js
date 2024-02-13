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
import { useNavigation } from '@react-navigation/core'
import { app, db, getFirestore, collection, addDoc, doc, setDoc, auth, getDoc, onSnapshot } from '../firebasecontrol'
import { signOut, onAuthStateChanged, reload, getAuth } from 'firebase/auth';
import { MaterialIcons } from "@expo/vector-icons";
const { width, height } = Dimensions.get('window');
const windowWidth = Dimensions.get('window').width;
const firestore = getFirestore();

const getEmailOfCurrentUser = () => {
    const user = auth.currentUser;
    if (user) {
      const email = user.email;
      return email;
    } else {
      console.log('No user is currently authenticated');
      return null;
    }
  };
  
 




export default function Checkpoint() {
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [emailCredential, setEmailCredential] = React.useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = React.useState(false);
  const [errorShow, setErrorShow] = React.useState(false);
  const [errorTitle, setErrorTitle] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const logo = require('../assets/RMJ SMTP.png');

  const navigation = useNavigation()

 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace("SMTP")
      }
      
    })

    return unsubscribe
  }, []) 
  


 

  
  return (
    
    <NativeBaseProvider>

      <Box bgColor='#7b9cff' w='100%' h='100%'>
      
        <Center flex={1}>
          <Center px="3">
            <Box w={[300, 400, 550]} h={[94, 125, 172]}>
              <Image source={{
                uri: logo
              }} resizeMode='stretch' alt="Real Motor Japan Control Hub" style={{ flex: 1, }} />
            </Box>
            {/* <LoginForm /> */}
          
            <Stack space={4} w="100%" alignItems="center">
              <HStack space={1} justifyContent="center">
            <Spinner color='white' size='lg'/>
            </HStack>
  </Stack>

          </Center>  

          
        </Center>

   
      </Box>
    </NativeBaseProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});


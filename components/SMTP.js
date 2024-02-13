import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TextInput,
  Pressable,
} from 'react-native';
import {
  Input,
  Icon,
  Stack,
  Center,
  PresenceTransition,
  NativeBaseProvider,
  Button,
  Box,
  HStack,
  Image,
  Container,
  Header,
  Left,
  Body,
  Title,
  Drawer,
  Content,
  Text,
  Heading,
  Flex,
  VStack,
  ScrollView,
  SectionList,
  Divider,
  Popover,
  Spinner,
} from "native-base";
import moment from 'moment';
import {
  FontAwesome,
  Entypo,
  MaterialIcons,
  Ionicons,
  Fontisto,
  EvilIcons,
  AntDesign,
  MaterialCommunityIcons,
  Feather,
  FontAwesome5Brands
} from 'react-native-vector-icons';
import FastImage from 'react-native-fast-image-web-support';

import { signOut, onAuthStateChanged, reload, getAuth, getIdTokenResult } from 'firebase/auth';
import { app, db, getFirestore, collection, addDoc, doc, setDoc, auth, getDoc, onSnapshot, updateDoc } from '../firebasecontrol'
import { useNavigation } from '@react-navigation/core'
import './styles.css';
import Papa from 'papaparse';
import axios from 'axios';



const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('window').height;

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


const IframeComponent = () => {
  return (
    <iframe
      id="iframeId"
      src="https://www.realmotor.jp/car_list/All/All/All/"
      style={{ width: 400, height: 400, }}
      title="Iframe Example"
    >
    </iframe>
  );
};


const NamePopover = ({ name, handleSignOut }) => {
  const [showNamePopover, setShowNamePopover] = useState(false);
  const showPopover = () => {
    setShowNamePopover(!showNamePopover);
  };

  return (
    <Box w={[100, 200, 1020]} h={[10, 10, 10]} flex={1}>
      <Flex direction="row-reverse">
        <Popover
          isOpen={showNamePopover}
          trigger={(triggerProps) => (
            <Text color="white" marginTop={[2, 2, 2]} fontSize={[17, 18, 20]} marginRight={[1, 3, 5]} {...triggerProps} onPress={showPopover}>
              <MaterialCommunityIcons name="account" size={[20, 25, 30]} color="white" /> {name} <Ionicons name="caret-down" size={16} color="white" />
            </Text>
          )}
          onClose={() => setShowNamePopover(!showNamePopover)}
          placement='bottom right'
          trapFocus={false}
        >
          <Popover.Content backgroundColor={'#7B9CFF'}>
            {/* <Popover.Arrow bgColor={'#7B9CFF'} /> */}
            <Popover.Body backgroundColor={'#7B9CFF'}>
              <Button _hover={{ bgColor: 'blueGray.500' }} onPress={handleSignOut} leftIcon={<MaterialCommunityIcons name="logout" size={20} color="white" />} bgColor={'transparent'}>
                Logout
              </Button>
            </Popover.Body>
          </Popover.Content>
        </Popover>
      </Flex>
    </Box>
  );
};

const FileUploadButton = ({ onFileSelected }) => {
  const fileInputRef = useRef(null);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelected(file);
    }
  };

  return (
    <View>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".csv"
      />
      <Button title="Upload CSV" onPress={handleFileInputClick} />
    </View>
  );
};

export default function SMTP() {

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [htmlContent, setHtmlContent] = useState(null);
  const [emails, setEmails] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successList, setSuccessList] = useState([]); // To track successfully sent emails



  const sendEmail = async (to, subject, htmlContent) => {
    try {
      const response = await fetch('http://34.97.108.2:2000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          htmlContent,
        }),
      });

      if (response.ok) {
        console.log('Email sent successfully');
      } else {
        console.error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  // Function to handle email sending
  const sendEmails = async () => {

    const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
    const { datetime } = response.data;
    const formattedTime = moment(datetime).format('MMMM D, YYYY');

    const emailArray = emails.split(/[\n,]+/).map(email => email.trim());
    const validEmails = emailArray.filter(email => email);
    let successfulEmails = [];
    setIsLoading(true);
    for (let email of validEmails) {
      try {
        await sendEmail(email, `Real Motor Japan | New Arrivals (${formattedTime})`, htmlContent);
        console.log(`Email sent to ${email}`);
        successfulEmails.push(email);
      } catch (error) {
        console.error(`Failed to send email to ${email}`, error);
      }
    }

    // Update state to reflect changes
    setSuccessList(successfulEmails);
    // Remove successful emails from TextInput
    setEmails(emails => emails.split(/[\n,]+/).filter(email => !successfulEmails.includes(email.trim())).join('\n'));
    console.log('All emails have been processed.');
    setIsLoading(false);

  };


  const handleDocumentChange = (snapshot) => {
    if (!snapshot.exists()) {
      signOut(auth)
        .then(() => {
          navigation.navigate('Login');
        })
        .catch((error) => {
          console.error('Error signing out:', error);
        });
    }
  };

  const subscribeToFieldChange = () => {
    const userId = auth.currentUser?.email;
    if (userId) {
      const userRef = doc(firestore, 'accounts', userId);
      const unsubscribe = onSnapshot(userRef, handleDocumentChange);
      return unsubscribe;
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToFieldChange();

    return () => {
      unsubscribe();
    };
  }, []);


  useEffect(() => {
    const currentUserEmail = getEmailOfCurrentUser();
    if (currentUserEmail) {
      getFieldValueByEmail(currentUserEmail);
      setEmail(currentUserEmail)
      const documentId = currentUserEmail;
      listenForNameChange(documentId);
    }
  }, []);

  const listenForNameChange = (documentId) => {
    const userRef = doc(db, 'accounts', documentId);

    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const name = doc.data().name;
        const type = doc.data().type;
        setName(name);
        setType(type);
        // Perform any necessary actions with the name value
      } else {
        console.log('Document does not exist');
      }
    });

    // To stop listening for updates, you can call unsubscribe()
    // unsubscribe();
  };



  const getFieldValueByEmail = async (email) => {
    try {
      const accountDocRef = doc(firestore, 'accounts', email);
      const accountDocSnapshot = await getDoc(accountDocRef);

      if (accountDocSnapshot.exists()) {
        const data = accountDocSnapshot.data();
        const fieldType = data.type;
        const fieldName = data.name;

      } else {
        console.log('Document does not exist');
      }
    } catch (error) {
      console.error('Error fetching field value:', error);
    }
  };



  const handleSignOut = () => {

    signOut(auth).then(() => {
      navigation.replace('Login');
      setEmail('');
      setName('');
    }).catch((error) => {
      // An error happened.
    });


  }


  const handleFileSelected = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        console.log('Parsed CSV data:', result.data);
        // Here you can do what you need with the parsed data
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
    },
  });

  // document.addEventListener('DOMContentLoaded', function () {
  //   const iframe = document.getElementById('container');
  //   const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
  // });

  // useEffect(() => {
  //   // Ensure the iframe has fully loaded
  //   const iframe = document.getElementById('iframeId');
  //   if (iframe) {
  //     iframe.onload = () => {
  //       const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
  //       const htmlContent = iframeDocument.documentElement.innerHTML;
  //       console.log(htmlContent); // Logs the HTML content of the iframe
  //     };
  //   }
  // }, []);
  function createMarkup(htmlContent) {
    return { __html: htmlContent };
  }

  useEffect(() => {
    fetch(`http://34.97.108.2:3000/api/proxy?url=${encodeURIComponent('https://www.realmotor.jp/car_list/All/All/All/')}`, {
    })
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");

        // Add the base URL to ensure relative URLs are resolved correctly.
        const base = document.createElement('base');
        base.href = 'https://www.realmotor.jp/car_list/All/All/All/';
        doc.head.insertBefore(base, doc.head.firstChild);

        // Optional: Inline external CSS for cross-origin stylesheets
        const stylesheets = doc.querySelectorAll('link[rel="stylesheet"]');
        Array.from(stylesheets).forEach(link => {
          // You might need to fetch and inline CSS content here, which can be complex and subject to CORS policies.
          // This step is complex and requires a server-side component or CORS-enabled endpoint.
        });

        // Serialize the document back to a string
        const serializer = new XMLSerializer();
        let serializedDoc = serializer.serializeToString(doc);
        setHtmlContent(serializedDoc);
        console.log(serializedDoc)
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);



  return (
    <SafeAreaView>

      <Box bgColor="#A6BCFE" h="100vh" w="full" flexDirection="column">

        <Box
          px="3"
          bgColor='#7b9cff'
          height={54}
          position="sticky"
          top={0}
          zIndex={999}
          flexDirection="row"
          alignItems="center"
          borderBottomWidth={2}
          borderBottomColor={'cyan.500'} >

          <Box w={200} h={10} marginBottom={1.5} marginTop={1.5}>
            <FastImage
              source={{
                uri: require('../assets/SMTP.png'), priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.stretch}
              style={styles.image}
            />
          </Box>

          <NamePopover name={name} handleSignOut={handleSignOut} />

        </Box>

        <View style={{ padding: 20 }}>


          <View
            style={{
              marginTop: 10,
              alignSelf: 'center',
              width: 300,
              height: 300,
              marginBottom: 15,
              backgroundColor: '#F8F9FF', // Card background color
              borderRadius: 10, // Rounded corners for the card
              shadowColor: '#000', // Shadow color
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 3, // Elevation for Android
              padding: 15, // Padding inside the card
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
            }}>

            {/* <Text>Upload a CSV File</Text>
          <FileUploadButton onFileSelected={handleFileSelected} /> */}

            {isLoading && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  zIndex: 1,
                  borderRadius: 10,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  width: 300,
                  height: 300,
                }}
              >
                <Spinner size="large" color="white" style={{ alignSelf: 'center', zIndex: 1 }} />

              </View>
            )}

            <View style={{ alignSelf: 'center', }}>
              <Text style={{
                fontWeight: 'bold',
                fontSize: 20,
                color: '#1C2B33',
              }}
                selectable={false}>
                Enter Emails:
              </Text>
              <TextInput
                multiline
                onChangeText={setEmails}
                value={emails}
                style={{
                  outlineStyle: 'none',
                  borderWidth: 1,
                  borderColor: '#D9D9D9',
                  width: 200,
                  padding: 10,
                  height: 200,
                }}
              />
              <Pressable
                onPress={sendEmails}
                onHoverIn={() => setIsHovered(true)}
                onHoverOut={() => setIsHovered(false)}
                style={{
                  marginTop: 10,
                  width: 180,
                  alignSelf: 'center',
                  padding: 5,
                  alignContent: 'center',
                  backgroundColor: isHovered ? '#158a3a' : '#16A34A',
                  borderRadius: 5,
                }}
              >
                <Text style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                  Send Update
                </Text>
              </Pressable>
              {/* <IframeComponent /> */}
              {/* <ScrollView >
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </ScrollView> */}


            </View>



          </View>
        </View>

        {successList.length > 0 &&
          <ScrollView style={{
            marginTop: 10,
            alignSelf: 'center',
            minHeight: 300,
            minWidth: 300,
            maxWidth: 300,
            maxHeight: 700,
            marginBottom: 15,
            backgroundColor: '#F8F9FF', // Card background color
            borderRadius: 10, // Rounded corners for the card
            shadowColor: '#000', // Shadow color
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 3, // Elevation for Android
            padding: 15, // Padding inside the card
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          }}>
            {successList.map((email, index) => (
              <View key={index} style={{
                backgroundColor: '#d1e8d9',
                padding: 10,
                marginVertical: 5,
                borderRadius: 5,
              }}>
                <Text style={{ color: '#333' }}>{`Email sent to:\n${email}`}</Text>
              </View>
            ))}
          </ScrollView>
        }

      </Box>




    </SafeAreaView>
  );
};




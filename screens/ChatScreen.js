import React, { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { Avatar } from "react-native-elements";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase/compat/app";
import { auth, db } from "../firebase";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar
            rounded
            source={{
              uri: "https://connectingcouples.us/wp-content/uploads/2019/07/avatar-placeholder.png",
            }}
          />
          <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
         style={{ marginLeft: 10}} 
         onPress={ navigation.goBack} 
        >
          <AntDesign name="arrowleft" size={24} color="blue" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View 
          style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: 80,
          marginLeft: 20,


        }}>

          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="blue" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);
  const sendMessage = () => {
    Keyboard.dismiss();

    db.collection('chat').doc(route.params.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,

    })

    setInput('')
  };

  useLayoutEffect(() => {
    const unsubscribe = db
    .collection('chat')
    .doc(route.params.id)
    .collection('messages')
    .orderBy('timestamp', 'desc')
    .onSnapshot((snapshot) => 
    setMessages(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),

      }))
    )
    );
    return unsubscribe;
  }, [route]);

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: "darkgrey"

    }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
        <ScrollView>
        {messages.map(({ id, data }) =>
        data.email === auth.currentUser.email ? (
                <View key={id} style={styles.reciever}>
                    <Avatar 
                    position="absolute"
                    rounded
                    bottom={-15}
                    right={-5}
                    size={30}
                    source={{
                      uri: data.photoURL,
                    }}
                    />
                    <Text style={styles.recieverText}>{data.message}</Text>
                </View>
            ) : (
                <View style={styles.sender}>
                     <Avatar />
                    <Text style={styles.senderText}>{data.message}</Text>
                </View>
            )
          )}
        </ScrollView>
        <View style={styles.footer}>
          <TextInput 
          value={input} 
          onChangeText={(text) => setInput(text)}
          onSubmitEditing={sendMessage}
          placeholder="Signal Message" 
          style={styles.TextInput}
          />
          <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
            <Ionicons name="send" size={24} color="blue" />
          </TouchableOpacity>
          </View>
        </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  TextInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    borderColor: "transparnt",
    padding: 10,
    color: "brown",
    borderRadius: 30,
  },
  reciever: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  }
})

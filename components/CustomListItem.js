import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ListItem, Avatar } from "react-native-elements";
import {db} from "../firebase"

const CustomListItem = ({ id, chatName, enterChat }) => {
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection('chat').doc(id).collection('messages').orderBy('timestap', 'desc').onSnapshot(snapshot => (
      setChatMessages(snapshot.docs.map(doc => doc.data()))
    ))
    return unsubscribe;
  });
  return (
    <ListItem key={id} onPress={() => enterChat(id, chatName)} key={id} bottomDivider>
      <Avatar
        rounded
        source={{ 

          uri: chatMessages?.[0]?.photoURL ||
           "https://connectingcouples.us/wp-content/uploads/2019/07/avatar-placeholder.png",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800" }}>
          {chatName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
         {chatMessages?.[0]?.displayName?.[0]?.messages}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;

const styles = StyleSheet.create({});

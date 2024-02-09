import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
} from "react-native";
import { supabase } from "../utils/Supabase";
import { useUser } from "../utils/UserContext";
import { RadioButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

export default PreviewModal = ({ challenge, onClose, onJoin }) => {
  const [communities, setCommunities] = useState([]);
  const { state, dispatch } = useUser();
  const [selectedCommunity, setSelectedCommunity] = useState("");

  async function fetchCommunities() {
    try {
      let { data: comms, error } = await supabase
        .from("communities")
        .select("*")
        .contains("members", [state.session.user.id]);
      setCommunities(comms);
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  }
  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleJoin = () => {
    if (challenge && challenge.id) {
      onJoin(challenge.id, selectedCommunity);
      onClose();
    }
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable
        style={{
          paddingVertical: 5,
          paddingHorizontal: 10,
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
        }}
        onPress={() => setSelectedCommunity(item.id)}
      >
        {selectedCommunity == item.id ? (
          <Ionicons size={20} color={"#61B8C2"} name="radio-button-on" />
        ) : (
          <Ionicons size={20} color={"grey"} name="radio-button-off" />
        )}
        <Text style={{ paddingLeft: 10 }}>{item.name}</Text>
      </Pressable>
    );
  };

  return (
    <Modal animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>{challenge?.name}</Text>
        <Image
          source={{ uri: challenge?.photo_url }}
          style={styles.modalImage}
        />
        <Text style={styles.modalDescription}>Info: {challenge?.description}</Text>
        <View style={{ display: "flex", flexDirection: "row" }}>
          {/* <Text style={{ fontWeight: "500" }}> hello</Text> */}
          {/* <Text>Active:{challenge?.total_goal}</Text> */}
          {/* <Image
            source={{ uri: challenge?.profiles?.avatar_url }}
            style={styles.profileImage}
          /> */}
          {/* <Text>{challenge?.challenges.total_goal}</Text> */}
        </View>

        {/* <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <Text>Active: {challenge?.challenges.total_goal}</Text>
          {challenge?.profiles.map((profile, index) => (
            <Image
              key={index} // Ideally, use a unique ID if available
              source={{ uri: profile.avatar_url }}
              style={styles.profileImage}
            />
          ))}
        </View> */}

        <Text
          style={{
            fontWeight: "bold",
            width: 300,
            marginTop: 20,
            fontSize: 16,
          }}
        >
          Choose Community
        </Text>
        <View
          style={{
            height: 115,
            marginTop: 10,
            width: 300,
            borderWidth: 2,
            borderRadius: 20,
            borderColor: "#ECECED",
          }}
        >
          <FlatList
            data={communities}
            numColumns={1}
            horizontal={false}
            renderItem={renderItem}
          ></FlatList>
        </View>

        <View style={styles.buttonContainer}>
          {selectedCommunity == "" ? (
            <Pressable
              style={{
                padding: 7,
                borderRadius: 20,
                backgroundColor: "#d2d2d2",
                fontFamily: "Avenir",
                color: "white",
              }}
            >
              <Text style={styles.joinButtonText}>Join Challenge</Text>
            </Pressable>
          ) : (
            <Pressable onPress={handleJoin} style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Join Challenge</Text>
            </Pressable>
          )}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "white",
    padding: 20,
  },
  modalTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Avenir",
  },
  modalImage: {
    width: 300,
    height: 300,
    marginBottom: 10,
    borderRadius: 20,
  },
  profileImage: {
    width: 20,
    height: 20,
    marginBottom: 5,
    borderRadius: 2,
  },
  modalDescription: {
    textAlign: "center",
    width: 280,
    marginBottom: 10,
    fontFamily: "Avenir",
    width: "80%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "55%",
    marginTop: 20,
  },
  closeButton: {
    padding: 7,
    borderRadius: 20,
    backgroundColor: "white",
    fontFamily: "Avenir",
    color: "#61B8C2",
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#61B8C2",
    fontFamily: "Avenir",
    margin: 5,
  },
  joinButton: {
    padding: 7,
    borderRadius: 20,
    backgroundColor: "#61B8C2",
    fontFamily: "Avenir",
    color: "white",
  },
  joinButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    fontFamily: "Avenir",
    margin: 5,
  },
});

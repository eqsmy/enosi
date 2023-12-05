import React from "react";
import { View, Text, Image, StyleSheet, Pressable, Modal } from "react-native";

export default PreviewModal = ({ challenge, isVisible, onClose, onJoin }) => {
  const handleJoin = () => {
    if (challenge && challenge.id) {
      onJoin(challenge.id);
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>{challenge?.name}</Text>
        <Image
          source={{ uri: challenge?.photo_url }}
          style={styles.modalImage}
        />
        <Text style={styles.modalDescription}>{challenge?.description}</Text>
        <Text>Total Goal Miles: {challenge?.total_goal}</Text>

        <View style={styles.buttonContainer}>
          <Pressable onPress={handleJoin} style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join Challenge</Text>
          </Pressable>
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
    width: "60%",
    marginTop: 20,
  },
  closeButton: {
    padding: 7,
    borderRadius: 20,
    backgroundColor: "#61B8C2",
    fontFamily: "Avenir",
    color: "white",
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
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

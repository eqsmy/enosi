import React from "react";
import { Image, Text, View, StyleSheet } from "react-native";

export function Avatar({ image, name }) {
  return (
    <View>
      <Text>{name}</Text>
      <Image source={{ uri: image }} style={style.avatar} />
    </View>
  );
}

export function AvatarStack({ avatars }) {

  if (avatars.length === 0) {
    return null;
  }
  return (
    <View style={styles.container}>
      {avatars.map((avatar, index) => (
        <Image
          key={index}
          source={{ uri: avatar.image }}
          style={[
            styles.image,
            { zIndex: avatars.length - index, marginLeft: -8 * index },
          ]}
        />
      ))}
    </View>
  );
}

const style = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarStack: {
    flexDirection: "row",
  },
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingLeft: 20, // Add padding to counteract the negative margin of the first image
  },
  image: {
    width: 40, // Set the size of the images
    height: 40,
    borderRadius: 20, // Half the size of the images to make them circular
    borderWidth: 2,
    borderColor: "white",
  },
});

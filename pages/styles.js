import { StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constants";

export const enosiStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  feedContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    top: 0,
  },
  textInput: {
    height: 40,
    margin: 12,
    width: "70%",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "lightgrey",
    marginVertical: 8,
  },
  uploadedImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    //marginBottom: 10,
  },
  uploadButtonText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 16,
    fontFamily: FONTS.bold,
    padding: 8,
    paddingHorizontal: 25,
    textAlign: "center",
  },
  searchBar: {
    height: 40,
    marginTop: 10,
    width: "100%",
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#f6f6f6",
    borderColor: "#e8e8e8",
    borderRadius: 20,
  },
});

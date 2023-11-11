import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

export function CancelButton({ navigation }) {
  return (
    <Button onPress={() => navigation.goBack()} title="Dismiss">
      <Ionicons name="close" color={"#FF4A00"} size={30} />
    </Button>
  );
}

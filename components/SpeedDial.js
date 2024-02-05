import React, { useState } from "react";
import { SpeedDial } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

const SpeedDial = () => {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();

  return (
    <SpeedDial
      isOpen={open}
      icon={{ name: "edit", color: "black" }}
      openIcon={{ name: "close", color: "#fff" }}
      onOpen={() => setOpen(!open)}
      onClose={() => setOpen(!open)}
    >
      <SpeedDial.Action
        icon={{ name: "add", color: "white" }}
        title="Log Activity"
        onPress={() => navigation.navigate("LogActivity")}
      />
      {/* Add more actions here as needed */}
    </SpeedDial>
  );
};

export default SpeedDial;

import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const Connectivity = () => {
  const [isConnected, setIsConnected] = useState(null);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View>
      <Text>{isConnected ? "Online" : "Offline"}</Text>
    </View>
  );
};

export default Connectivity;

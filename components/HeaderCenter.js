import { AntDesign } from "@expo/vector-icons";

import { Image, View, StyleSheet } from "react-native";
const HeaderCenter = () => {
  return (
    <Image source={require("../assets/logo-airbnb.png")} style={styles.logo} />
  );
};

export default HeaderCenter;
const styles = StyleSheet.create({
  logo: {
    height: 30,
    width: 30,
    marginBottom: 5,
  },
});

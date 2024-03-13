import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image, View, StyleSheet } from "react-native";
const BtnHome = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <Image
        source={require("../assets/logo-airbnb.png")}
        style={styles.logo}
      />
    </View>
  );
};

export default BtnHome;
const styles = StyleSheet.create({
  header: { flexDirection: "row", marginLeft: 155 },
  logo: {
    height: 30,
    width: 30,
    marginBottom: 5,
  },
});

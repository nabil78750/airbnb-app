import { useNavigation } from "@react-navigation/core";
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";
import { useState } from "react";
import axios from "axios";

export default function SignInScreen({ setToken, setId }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async () => {
    try {
      if (email && password) {
        const { data } = await axios.post(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/log_in",
          { email, password }
        );

        console.log("sign in data>>>", data);

        if (setToken(data.token)) {
          alert("Vous étes connecté à votre compte");
          setId(data.id);
        }
      } else {
        setErrorMessage("Veuillez remplir tous les champs");
      }
    } catch (error) {
      console.log("sign in catch>>>", error);
      setErrorMessage("Un erreur est survenu, veuillez réessayer !");
    }
  };
  const navigation = useNavigation();
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollView}
    >
      <Image
        source={require("../assets/logo-airbnb.png")}
        style={styles.logoairbnb}
      />
      <Text style={styles.titleLogo}>Sign in</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setErrorMessage(""), setEmail(text);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry={true}
        onChangeText={(text) => {
          setErrorMessage(""), setPassword(text);
        }}
      />

      <View style={styles.signin}>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <TouchableOpacity style={styles.btn} onPress={handleSignIn}>
          <Text style={styles.textSign}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.account}>No account? Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  container: { paddingTop: Constants.statusBarHeight },
  scrollView: {
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  containerLogo: { alignItems: "center", marginTop: 30, marginBottom: 20 },
  titleLogo: { fontSize: 22, color: "#717171", fontWeight: "bold" },
  logoairbnb: {
    height: 100,
    width: 100,
    resizeMode: "contain",
    marginBottom: 15,
  },
  input: {
    height: 40,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "coral",
    marginBottom: 40,
  },
  inputText: {
    height: 100,
    width: "100%",

    borderWidth: 1,
    borderColor: "coral",
    marginBottom: 10,
    padding: 10,
  },
  signin: { alignItems: "center" },
  btn: {
    marginTop: 20,
    height: 50,
    width: 170,
    borderWidth: 2,
    borderColor: "coral",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  errorMessage: { fontSize: 13, color: "red" },
  textSign: { fontSize: 16 },
  account: { fontSize: 13, color: "grey", marginTop: 15 },
});

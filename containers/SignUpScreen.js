import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";
import { useState } from "react";
import axios from "axios";

export default function SignUpScreen({ setToken, navigation, setId }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async () => {
    try {
      if (email && username && password && description) {
        if (password == confirmPassword) {
          const { data } = await axios.post(
            "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/sign_up",
            { email, username, password, description }
          );

          console.log("sign up -data", data);

          if (setToken(data.token)) {
            alert("Votre compte a été créé");
            setId(data.id);
          }
        } else {
          setErrorMessage("Les mots de passe doivent être identiques");
        }
      } else {
        setErrorMessage("Veuillez remplir tous les champs");
      }
    } catch (error) {
      console.log("Signup- catch>>>", error.response.data);
      setErrorMessage("Un erreur est survenu, veuillez réessayer !");
    }
  };
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollView}
      // style={styles.containerLogo}
    >
      <Image
        source={require("../assets/logo-airbnb.png")}
        style={styles.logoairbnb}
      />
      <Text style={styles.titleLogo}>Signup </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setErrorMessage("");
          setEmail(text);
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="username"
        value={username}
        onChangeText={(text) => {
          setErrorMessage("");
          setUsername(text);
        }}
      />
      <TextInput
        editable
        multiline
        placeholder="Describe yourself in a few words..."
        numberOfLines={4}
        textAlignVertical="top"
        maxLength={200}
        onChangeText={(text) => {
          setErrorMessage("");
          setDescription(text);
        }}
        value={description}
        style={styles.inputText}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry={true}
        onChangeText={(text) => {
          setErrorMessage("");
          setPassword(text);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        value={confirmPassword}
        secureTextEntry={true}
        onChangeText={(text) => {
          setErrorMessage("");
          setconfirmPassword(text);
        }}
      />

      <View style={styles.signup}>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <TouchableOpacity style={styles.btn} onPress={handleSignUp}>
          <Text style={styles.textSign}>Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.account}>Already have an account? Sign in</Text>
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
  signup: { alignItems: "center" },
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

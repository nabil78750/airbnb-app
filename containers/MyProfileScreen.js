import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen({ setToken, Id, userToken }) {
  const [data, setData] = useState([]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState();

  const askPermissionAndLaunchLibrary = async () => {
    try {
      // demande la permission à l'utilisateurr

      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status === "granted") {
        //permisson accordée => ouverture de lla librairie de photos

        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
        });
        console.log(result.assets[0].uri);

        if (result.canceled) {
          alert("No Image selected");
        } else {
          setSelectedImage(result.assets[0].uri);
        }
      } else {
        //Permission non accorée
        alert("Accès refusé");
      }
    } catch (error) {
      console.log("catch>>>", error);
    }
  };
  const askPermissionAndLaunchCamera = async () => {
    try {
      // Demande la permission à l'utilisateur
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      console.log(status);

      if (status === "granted") {
        // Permission accordée => ouverture de la caméra
        const result = await ImagePicker.launchCameraAsync();

        console.log(result);

        if (result.canceled) {
          // Si la caméra est fermée sans prendre de photo
          alert("No image selected");
        } else {
          setSelectedImage(result.assets[0].uri);
        }
      } else {
        // Permission non accordée
        alert("Accès refusé");
      }
    } catch (error) {
      console.log("catch>>", error);
    }
  };

  const sendPict = async () => {
    if (selectedImage) {
      try {
        // Récupérer l'extension du fichier
        const extension = selectedImage.split(".").at(-1);
        // console.log(selectedImage.split(".").at(-1));

        //OU=>>
        // const tab = selectedImage.split(".");
        // const extension = tab[tab.length - 1];
        // console.log("send pict, extension >> ", extension);

        // Création du formData
        const formData = new FormData();
        formData.append("photo", {
          uri: selectedImage,
          name: `my-image.${extension}`,
          type: `image/${extension}`,
        });

        //route pour ajouter ou modifier la photo de profil d'un utilisateur :
        const { data } = await axios.put(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/upload_picture",
          formData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("send picture, data >>> ", data);
      } catch (error) {
        console.log("send picture, error >>>> ", error);
      }
    }
  };
  //route pour modifier les informations de l'utilisateur (email, username et description) :
  const modifUser = async () => {
    try {
      const { data } = await axios.put(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/update",
        {
          email: email,
          description: description,
          username: username,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log("modifUser data>>>", data);
      //Appel de la fonction pour modifier ou ajouter la photo du profile de l'utilisateur
      sendPict();
    } catch (error) {
      console.log("modifUser catch", error);
    }
  };
  // route pour obtenir les informations d'un utilisateur et les afficher sur l'écran:
  useEffect(() => {
    const fechData = async () => {
      try {
        const { data } = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/${Id}`,

          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("data>>>>>", data);
        setData(data);
        setEmail(data.email);
        setDescription(data.description);
        setUsername(data.username);
        setSelectedImage(data.photo.url);
      } catch (error) {
        console.log("catch>>", error);
      }
      setIsLoading();
    };

    fechData();
  }, []);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.photoProfile}>
        {/* Affiche la photo sélectionnée */}
        <Image
          source={
            selectedImage
              ? { uri: selectedImage }
              : require("../assets/User-Profile.png")
          }
          style={styles.img}
        />
        <View style={styles.bntPhoto}>
          <TouchableOpacity onPress={askPermissionAndLaunchLibrary}>
            <FontAwesome5 name="images" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={askPermissionAndLaunchCamera}>
            <FontAwesome5 name="camera" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
        }}
      />

      <TextInput
        style={styles.input}
        value={username}
        onChangeText={(text) => {
          setUsername(text);
        }}
      />
      <TextInput
        editable
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        maxLength={200}
        onChangeText={(text) => {
          setDescription(text);
        }}
        value={description}
        style={styles.inputText}
      />
      <TouchableOpacity style={styles.btnUpdate} onPress={modifUser}>
        <Text style={styles.fonSize}>Update</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={async () => {
          setToken(null);
          // await AsyncStorage.removeItem("userToken");
          // await AsyncStorage.removeItem("userId");
        }}
      >
        <Text style={styles.fonSize}>Log out</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 40,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  photoProfile: { flexDirection: "row", gap: 20 },
  bntPhoto: { alignSelf: "center", gap: 30 },
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
  btn: {
    backgroundColor: "#e7e7e7",
    marginTop: 20,
    height: 50,
    width: 170,
    borderWidth: 2,
    borderColor: "red",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  btnUpdate: {
    marginTop: 20,
    height: 50,
    width: 170,
    borderWidth: 2,
    borderColor: "red",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  fonSize: { fontSize: 16 },
  img: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: "coral",
  },
});

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { useState, useEffect } from "react";

export default function HomeScreen({ navigation }) {
  const [roomsList, setRoomsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fechData = async () => {
      try {
        const { data } = await axios.get(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
        );
        // console.log("home data>>>", JSON.stringify(data, null, 2));
        setRoomsList(data);
      } catch (error) {
        console.log("Home catch>>>", error);
      }
      setIsLoading(false);
    };
    fechData();
  }, []);

  const displayStars = (rate) => {
    //Créer un tableau vide
    const tab = [];
    // Boucle de 5 tours car toujours 5 étoiles
    for (let i = 1; i <= 5; i++) {
      // A chaque tour=> est ce que je suis à un tour inférieur ou égal à la note
      if (i <= rate) {
        // si oui => etoile pleine envoyé au tableau
        tab.push(<AntDesign name="star" size={24} color="#ffb100" key={i} />);
      } else {
        // si non => etoile vide envoyé au tableau
        tab.push(<AntDesign name="star" size={24} color="grey" key={i} />);
      }
    }
    return tab;
  };

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <FlatList
      data={roomsList}
      keyExtractor={(room) => room._id}
      renderItem={({ item }) => {
        // console.log(
        //   "Homescreen - faltlist >>",
        //   JSON.stringify(item.location, null, 2)
        // );

        return (
          <TouchableOpacity
            style={styles.room}
            onPress={() => {
              navigation.navigate("Room", { id: item._id });
            }}
          >
            {/* Image en arrière plan */}
            <ImageBackground
              source={{ uri: item.photos[0].url }}
              style={styles.photo}
            >
              <Text style={styles.price}>{item.price} €</Text>
            </ImageBackground>

            <View style={styles.profil}>
              <View>
                <Text numberOfLines={1}>{item.title}</Text>
                <View style={styles.revw}>
                  {/* Affichage des étoiles */}
                  <Text>
                    {displayStars(item.ratingValue)} {item.reviews} reviews
                  </Text>
                </View>
              </View>
              <Image
                source={{ uri: item.user.account.photo.url }}
                style={styles.avatar}
              />
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}
const styles = StyleSheet.create({
  room: {
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    marginVertical: 7,
  },
  containerPhoto: {
    position: "absolute",
    top: 210,
    left: 9,
    backgroundColor: "black",
    width: 90,
    height: 40,
  },
  photo: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    justifyContent: "flex-end",
  },
  price: {
    color: "white",
    fontSize: 18,
    backgroundColor: "black",
    width: 70,
    textAlign: "center",
    paddingVertical: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: "contain",
    margin: 8,
  },
  profil: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  revw: { flexDirection: "row" },
});

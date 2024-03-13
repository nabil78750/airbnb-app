import {
  Text,
  View,
  Image,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function RoomScreen({ route }) {
  const { id } = route.params;
  const [roomInfos, setRoomInfos] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fechtData = async () => {
      try {
        const { data } = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/${id}`
        );

        console.log("RoomScreen>>>", JSON.stringify(data, null, 2));

        setRoomInfos(data);
      } catch (error) {
        console.log("RoomScrenn catch>>>", error);
      }
      setIsLoading(false);
    };
    fechtData();
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
    <View style={styles.room}>
      {/* Image en arrière plan */}
      <ImageBackground
        source={{ uri: roomInfos.photos[0].url }}
        style={styles.photo}
      >
        <Text style={styles.price}>{roomInfos.price} €</Text>
      </ImageBackground>

      <View style={styles.profil}>
        <View>
          <Text>{roomInfos.title}</Text>
          <View style={styles.revw}>
            {/* Affichage des étoiles */}
            <Text>
              {displayStars(roomInfos.ratingValue)} {roomInfos.reviews} reviews
            </Text>
          </View>
        </View>
        <Image
          source={{ uri: roomInfos.user.account.photo.url }}
          style={styles.avatar}
        />
      </View>
      <View style={styles.description}>
        <Text numberOfLines={3}>{roomInfos.description}</Text>
      </View>

      <MapView
        style={styles.map}
        // Pour que l'IPhone utilise google maps
        provider={PROVIDER_GOOGLE}
        // Déterminer la position sur laquelle la carte ce centre
        initialRegion={{
          latitude: 48.856614,
          longitude: 2.3522219,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        showsUserLocation
      >
        {/* // Affichage des épingles */}
        <Marker
          coordinate={{
            latitude: roomInfos.location[1],
            longitude: roomInfos.location[0],
          }}
          // S'affiche lors de l'appui sur l'épingle
          title={roomInfos.title}
          description={roomInfos.description}
        />
      </MapView>
    </View>
  );
}
const styles = StyleSheet.create({
  room: {
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
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  revw: { flexDirection: "row" },
  description: { paddingHorizontal: 10 },
  map: { height: 300 },
});

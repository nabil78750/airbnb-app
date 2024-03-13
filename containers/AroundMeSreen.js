import { Text, ActivityIndicator, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useState, useEffect } from "react";
import axios from "axios";
import * as Location from "expo-location";

export default function ArooundMeScreen({ navigation }) {
  // Par défaut la carte sera centré sur Paris
  const [userCoords, setUserCoords] = useState({
    latitude: 48.856614,
    longitude: 2.3522219,
  });
  const [roomsList, setRoomsList] = useState([]);
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    const askPermission = async () => {
      try {
        // Demande la persimission d'accèder à la localisation de l'utilisateur
        const { status } = await Location.requestForegroundPermissionsAsync();

        // console.log(status);

        if (status === "granted") {
          // Accède à la position actuelle de l'utilisateur
          const { coords } = await Location.getCurrentPositionAsync();

          // console.log(coords);
          //   On la transmet au state pour l'utiliser pour centrer la carte
          setUserCoords({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
          //   Récupération des 'room' proche de l'utilisateur
          const { data } = await axios.get(
            `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=${coords.latitude}&longitude=${coords.longitude}`
          );
          console.log("around data>>>", data);
          setRoomsList(data);
        } else {
          // Accès à la position refusée donc récupération de toutes les 'room'
          const { data } = await axios.get(
            "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
          );

          //   console.log(data);

          setRoomsList(data);
        }
      } catch (error) {
        console.log("Around catch>>>>", error.response);
      }
      setIsLoading(false);
    };

    askPermission();
  }, []);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View style={styles.container}>
      {/* <Text>{location}</Text> */}
      <MapView
        style={styles.map}
        // Pour que l'IPhone utilise google maps
        provider={PROVIDER_GOOGLE}
        // Détermine la position sur laquelle la carte ce centre
        initialRegion={{
          latitude: userCoords.latitude,
          longitude: userCoords.longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        // Affiche un point bleu indiquant la position de l'utilisateur (seulement s'il a accepté de partager sa localisation)
        showsUserLocation
      >
        {/* Affichage d'un marqueur par 'room' */}
        {roomsList.map((coord) => {
          // console.log("coord>>>", coord);
          return (
            // Affichage des épingles
            <Marker
              key={coord._id}
              coordinate={{
                latitude: coord.location[1],
                longitude: coord.location[0],
              }}
              // S'affiche lors de l'appui sur l'épingle
              title={coord.title}
              description={coord.description}
              onPress={() => {
                // A l'appui sur une épingle, on navigue vers l'écran qui affiche les informations de la 'room'
                navigation.navigate("RoomMap", { id: coord._id });
              }}
            />
          );
        })}
      </MapView>
    </View>
  );
}
const styles = StyleSheet.create({ map: { height: 700 } });

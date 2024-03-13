import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import HomeScreen from "./containers/HomeScreen";
import RoomScreen from "./containers/RoomScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import MyProfileScreen from "./containers/MyProfileScreen";
import HeaderCenter from "./components/HeaderCenter";
import AroundMeScreen from "./containers/AroundMeSreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [Id, setId] = useState("");

  const setToken = async (token) => {
    if (token) {
      await AsyncStorage.setItem("userToken", token);
    } else {
      await AsyncStorage.removeItem("userToken");
    }

    setUserToken(token);
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    // Récupérez le jeton depuis le stockage puis accédez à l'endroit approprié
    const bootstrapAsync = async () => {
      // We should also handle error for production apps
      // Nous devrions également gérer les erreurs pour les applications de production
      const userToken = await AsyncStorage.getItem("userToken");

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      // Cela passera à l'écran App ou à l'écran Auth et ce chargement
      // l'écran sera démonté et jeté.
      setUserToken(userToken);

      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading === true) {
    // We haven't finished checking for the token yet
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken === null ? (
          // No token found, user isn't signed in
          <>
            <Stack.Screen
              name="SignIn"
              options={/*on cache le header*/ { headerShown: false }}
            >
              {/* 👇 transmettre les props navigatione et route 👇 */}
              {() => <SignInScreen setToken={setToken} setId={setId} />}
            </Stack.Screen>

            <Stack.Screen
              name="SignUp"
              options={/*on cache le header*/ { headerShown: false }}
            >
              {/* 👇 transmettre les props navigatione et route 👇 */}
              {(props) => (
                <SignUpScreen setToken={setToken} setId={setId} {...props} />
              )}
            </Stack.Screen>
          </>
        ) : (
          // User is signed in ! 🎉
          <Stack.Screen name="Tab" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarActiveTintColor: "tomato",
                  tabBarInactiveTintColor: "gray",
                }}
              >
                <Tab.Screen
                  name="TabHome"
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"home"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        // Personnalisation du header
                        headerTitle: () => <HeaderCenter />,
                        // Centrage sur Android
                        headerTitleAlign: "center",
                      }}
                    >
                      <Stack.Screen name="Home">
                        {(props) => <HomeScreen {...props} />}
                      </Stack.Screen>

                      <Stack.Screen name="Room">
                        {(props) => <RoomScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                {/* -------------------------------------------- */}
                {/* -------------------------------------------- */}
                {/* -- AJOUT DU 3ème ONGLET ____________________ */}
                {/* -------------------------------------------- */}
                {/* -------------------------------------------- */}

                <Tab.Screen
                  name="TabAroundMe"
                  options={{
                    tabBarLabel: "Around me",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons
                        name={"location-outline"}
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        // Personnalisation du header
                        headerTitle: () => <HeaderCenter />,
                        // Centrage sur Android
                        headerTitleAlign: "center",
                      }}
                    >
                      <Stack.Screen name="Around me">
                        {(props) => <AroundMeScreen {...props} />}
                      </Stack.Screen>
                      <Stack.Screen name="RoomMap">
                        {(props) => <RoomScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="TabMyProfile"
                  options={{
                    tabBarLabel: "MyProfile",
                    tabBarIcon: ({ color, size }) => (
                      <AntDesign name="user" size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        // Personnalisation du header
                        headerTitle: () => <HeaderCenter />,
                        // Centrage sur Android
                        headerTitleAlign: "center",
                      }}
                    >
                      <Stack.Screen name="MyProfile">
                        {(props) => (
                          <MyProfileScreen
                            setToken={setToken}
                            Id={Id}
                            userToken={userToken}
                            {...props}
                          />
                        )}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, View } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import StudentDetailsScreen from "./screens/StudentDetailsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import SubjectsByGradeScreen from "./screens/SubjectsByGradeScreen";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  StudentDetailsScreen: { gradeId: string };
  SubjectsByGradeScreen: { gradeId: string };
  Profile: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#00ba8b" }, // Cambia el color del header
          headerTintColor: "#fff", // Color del texto e íconos
          headerTitleStyle: { fontWeight: "bold" }, // Estilos del título
        }}
        initialRouteName="Login"
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: "Home",
            headerLeft: () => (
              <TouchableOpacity onPress={() => alert("Menu opened")}>
                <Ionicons name="menu" size={28} color="white" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("Notifications")}
                >
                  <Ionicons name="notifications" size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Profile")}
                >
                  <Ionicons
                    name="person-circle-outline"
                    size={28}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="StudentDetailsScreen"
          component={StudentDetailsScreen}
          options={{
            title: "Detalles de Materia",
          }}
        />
        <Stack.Screen
          name="SubjectsByGradeScreen"
          component={SubjectsByGradeScreen}
          options={{ title: "Materias del Grado" }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: "Mi Perfil",
          }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            title: "Notificaciones",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

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
import MenuModal from "./shared/MenuModal";
import StudentManagementScreen from "./screens/StudentManagementScreen";
import UserManagementScreen from "./screens/UserManagementScreen";
import GradeManagementScreen from "./screens/GradeManagementScreen";
import SubjectManagementScreen from "./screens/SubjectManagementScreen";
import RelationshipScreen from "./screens/RelationshipScreen";
import AttendanceChart from "./screens/AttendanceChart";
import ReportScreen from "./screens/ReportScreen";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  StudentManagementScreen: undefined;
  UserManagementScreen: undefined;
  GradeManagementScreen: undefined;
  SubjectManagementScreen: undefined;
  RelationshipManagementScreen: undefined;
  AttendanceChart: undefined;
  StudentDetailsScreen: { gradeId: string };
  SubjectsByGradeScreen: { gradeId: string };
  Profile: undefined;
  Notifications: undefined;
  Report: undefined;
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
            headerLeft: () => <MenuModal />,
            headerRight: () => (
              <View
                style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-around', gap: 8 }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("Notifications")}
                >
                  <Ionicons name="notifications" size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Report")}
                >
                  <Ionicons name="flag" size={28} color="white" />
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
          name="StudentManagementScreen"
          component={StudentManagementScreen}
          options={{
            title: "Administrar Estudiantes",
          }}
        />
        <Stack.Screen
          name="UserManagementScreen"
          component={UserManagementScreen}
          options={{
            title: "Administrar Usuarios",
          }}
        />
        <Stack.Screen
          name="AttendanceChart"
          component={AttendanceChart}
          options={{
            title: "Graficos de Asistencia",
          }}
        />
        <Stack.Screen
          name="GradeManagementScreen"
          component={GradeManagementScreen}
          options={{
            title: "Administrar Grados",
          }}
        />
        <Stack.Screen
          name="SubjectManagementScreen"
          component={SubjectManagementScreen}
          options={{
            title: "Administrar Materias",
          }}
        />
        <Stack.Screen
          name="RelationshipManagementScreen"
          component={RelationshipScreen}
          options={{
            title: "Administrar Relaciones",
          }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            title: "Notificaciones",
          }}
        />
        <Stack.Screen
          name="Report"
          component={ReportScreen}
          options={{
            title: "Reporte de Asistencia",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, View } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';

// Definir los parámetros de cada pantalla
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "center", // Centra el título
        }}
        initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{
            headerShown: false, // Oculta el header en Login
          }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{
            headerShown: false, // Oculta el header en Login
          }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={({ navigation }) => ({
            title: "Home", // Título del header
            headerLeft: () => (
              <TouchableOpacity onPress={() => alert("Menú abierto")}>
                <Ionicons name="menu" size={28} color="black" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <View style={{ flexDirection: "row", gap: 15, marginRight: 10 }}>
                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                  <Ionicons name="notifications" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                  <Ionicons name="person-circle-outline" size={28} color="black" />
                </TouchableOpacity>
              </View>
            ),
          })} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
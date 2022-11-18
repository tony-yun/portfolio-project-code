import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BLUE_COLOR, DARK_GREY } from "assets/color/Palette";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import SettingScreen from "screens/SettingScreen";
import HomeScreen from "screens/HomeScreen";

const BottomTab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity style={styles.shadow} onPress={onPress} disabled={true}>
    <View style={styles.view}>{children}</View>
  </TouchableOpacity>
);

const Tab = () => {
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          position: "absolute",
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          borderRadius: 50,
          ...styles.shadow,
          height: "8%",
        },
        tabBarInactiveTintColor: DARK_GREY,
        tabBarActiveTintColor: BLUE_COLOR,
      }}
    >
      <BottomTab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.icon}>
              {focused ? (
                <Ionicons name="home" color={color} size={28} />
              ) : (
                <Ionicons name="home-outline" color={color} size={28} />
              )}
            </View>
          ),
          headerTitle: "Home",
        }}
      />
      <BottomTab.Screen
        name="FakeScreen"
        component={FakeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("assets/images/waterai2.png")}
              resizeMode="contain"
              style={styles.image}
            />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <BottomTab.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.icon}>
              {focused ? (
                <Ionicons name="settings" color={color} size={28} />
              ) : (
                <Ionicons name="settings-outline" color={color} size={28} />
              )}
            </View>
          ),
          headerTitle: "Setting",
        }}
      />
    </BottomTab.Navigator>
  );
};

export default Tab;

const styles = StyleSheet.create({
  // {/*  */}
});

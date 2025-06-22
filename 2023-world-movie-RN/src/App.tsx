import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./navigation/RootStack";
import "react-native-devsettings";
import "react-native-devsettings/withAsyncStorage";
import { PortalProvider } from "@gorhom/portal";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthProvider from "@/AuthContext";
import CodePush from "react-native-code-push";

const App: React.FC = (): JSX.Element => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer theme={}>
          <PortalProvider>
            <RootStack />
          </PortalProvider>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default CodePush(App);

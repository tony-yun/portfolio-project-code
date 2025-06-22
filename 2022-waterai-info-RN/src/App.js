import React, { useEffect } from "react";
import SplashScreen from "react-native-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "components/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const NativeStack = createNativeStackNavigator();

const App = () => {
  const initialLoginState = {
    userToken: null,
  }; //default state, use reducer to change.

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          userToken: action.userToken,
        };
      case "REGISTER":
        return {
          ...prevState,
          // userToken: action.userToken,
        };
      case "LOGIN":
        return {
          ...prevState,
          userToken: action.userToken,
        };
      case "LOGOUT":
        return {
          ...prevState,
          userToken: null,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async (props) => {
        axios
          .post(`${BASE_URL}/api`, {
            phonenumber,
            password,
          })
          .then((res) => {
            console.log(res);
            if (res?.data?.ok === true) {
              AsyncStorage.setItem(
                "userToken",
                JSON.stringify(res?.data?.token)
              );
              console.log(res?.data?.token);
              dispatch({
                type: "LOGIN",
                userToken: res?.data?.token,
              });
            } else {
              Alert.alert(`${res?.data?.error}`);
            }
          })
          .catch((e) => Alert.alert(e));
      },

      signOut: async () => {
        try {
          await AsyncStorage.removeItem("userToken");
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGOUT" });
      },

      signUp: async (props) => {
        await axios
          .post(`${BASE_URL}/api`, {
            ...props,
          })
          .then((res) => {
            console.log("res:", res);
            if (res?.data?.ok === true) {
              dispatch({ type: "REGISTER" });
              Alert
                .alert
                // ...
                ();
            } else {
              Alert.alert(`${res?.data?.error}`);
            }
          })
          .catch((e) => Alert.alert(e));
      },
    }),
    []
  );

  const onRefresh = React.useCallback(() => {
    wait(2000).then(() => SplashScreen.hide());
  }, []);

  const checkToken = async () => {
    let userToken;
    userToken = null;
    try {
      userToken = await AsyncStorage.getItem("userToken");
      console.log("checkedToken:", userToken);
    } catch (e) {
      console.log(e);
    } //userToken: null -> getItem -> dispatch
    dispatch({ type: "RETRIEVE_TOKEN", userToken: userToken });
  };

  useEffect(() => {
    onRefresh();
    checkToken();
  }, [onRefresh]);

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <NativeStack.Navigator screenOptions={{ headerShown: false }}>
          {loginState.userToken === null ? (
            {
              /*  */
            }
          ) : (
            <>{/*  */}</>
          )}
        </NativeStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};
export default App;

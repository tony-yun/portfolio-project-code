import React, { createContext, useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userFavoriteArray, setUserFavoriteArray] = useState([]);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        ...
        });
      } else {
        setUserFavoriteArray([]);
      }
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  const refreshUser = () => {
    const user = auth().currentUser;
    if (user) {
      ...
      });
    }
  };

  const handleSignIn = (email, password, onSuccess, onError) => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        ...
      })
      .catch((error) => {
        ...
      });
  };

  const handleSignUp = (email, password, onSuccess, onError) => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        ...
      })
      .catch((error) => {
        ...
      });
  };

  const handleSignout = (onSuccess, onError) => {
    auth()
      .signOut()
      .then((response) => {
        ...
      })
      .catch((error) => {
        ...
      });
  };

  const handleChangePassword = (
    email,
    password,
    changedPassword,
    onSuccess,
    onError
  ) => {
    const credential = auth.EmailAuthProvider.credential(email, password);
    currentUser
      .reauthenticateWithCredential(credential)
      .then(() => {
        return currentUser.updatePassword(changedPassword);
      })
      .then((response) => {
        /...
      })
      .catch((error) => {
        ...
      });
  };

  const handleDeleteUser = (email, password, onSuccess, onError) => {
    const credential = auth.EmailAuthProvider.credential(email, password);
    currentUser
      .reauthenticateWithCredential(credential)
      .then(() => {
        return currentUser.delete();
      })
      .then((response) => {
        ...
      })
      .catch((error) => {
        ...
      });
  };

  const sendEmailVerification = (onSuccess, onError) => {
    if (currentUser) {
      currentUser
        .sendEmailVerification()
        .then((response) => {
          ...
        })
        .catch((error) => {
          ...
        });
    }
  };

  const sendPasswordResetEmail = (email, onSuccess, onError) => {
    auth()
      .sendPasswordResetEmail(email)
      .then((response) => {
        ...
      })
      .catch((error) => {
        ...
      });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userFavoriteArray,
        setUserFavoriteArray,
        refreshUser,
        handleSignIn,
        handleSignUp,
        handleSignout,
        handleChangePassword,
        handleDeleteUser,
        sendEmailVerification,
        sendPasswordResetEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

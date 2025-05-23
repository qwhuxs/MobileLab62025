import React, { createContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await AsyncStorage.setItem("user", JSON.stringify(firebaseUser));
        setUser(firebaseUser);
      } else {
        await AsyncStorage.removeItem("user");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (!email.includes("@")) {
      throw new Error("Будь ласка, введіть коректний email");
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password) => {
    if (!email.includes("@")) {
      throw new Error("Будь ласка, введіть коректний email");
    }
    if (password.length < 6) {
      throw new Error("Пароль повинен містити щонайменше 6 символів");
    }
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {
      name: "",
      age: "",
      city: "",
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateProfile = async (name, age, city) => {
    if (!auth.currentUser) throw new Error("Користувач не авторизований");

    try {
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          name,
          age,
          city,
        },
        { merge: true }
      );
    } catch (error) {
      throw error;
    }
  };

  const reauthenticate = async (password) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email)
      throw new Error("Користувач не авторизований");

    const credential = EmailAuthProvider.credential(
      currentUser.email,
      password
    );
    try {
      await reauthenticateWithCredential(currentUser, credential);
      return true;
    } catch (error) {
      throw new Error("Невірний пароль");
    }
  };

  const deleteAccount = async (password) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Користувач не авторизований");

    try {
      await reauthenticate(password);
      await deleteDoc(doc(db, "users", currentUser.uid));
      await currentUser.delete();
      await logout();
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
        deleteAccount,
        reauthenticate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultProfile = {
    fullname: '',
    email: '',
    i_am: '',
    interested_in: '',
    age: '',
    about: '',
    likes: [],
    interests: [],
    hobbies: [],
    skin_color: '',
    height: '',
    weight: '',
    address: '',
    category: '',
};

const UserProfileContext = createContext(null);

export const UserProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(defaultProfile);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🧠 Load user and token separately from AsyncStorage
    useEffect(() => {
        const loadStoredData = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                const storedToken = await AsyncStorage.getItem('token');
                if (storedUser) setUser(JSON.parse(storedUser));
                if (storedToken) setToken(storedToken);
            } catch (error) {
                console.error('Error loading data from storage:', error);
            } finally {
                setLoading(false);
            }
        };
        loadStoredData();
    }, []);

    // ✅ Update user profile data (used during setup)
    const updateProfile = (newData) => {
        setProfile((prev) => ({ ...prev, ...newData }));
    };

    // ✅ Called after login/signup (store user + token)
    const login = async ({ userData, token }) => {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            await AsyncStorage.setItem('token', token);
            setUser(userData);
            setToken(token);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    // 🚪 Clear everything on logout
    const logout = async () => {
        try {
            await AsyncStorage.multiRemove(['user', 'token']);
            setUser(null);
            setToken(null);
            setProfile(defaultProfile);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // 🔐 Expose token getter for API headers
    const getToken = () => token;

    return (
        <UserProfileContext.Provider
            value={{
                profile,
                updateProfile,
                user,
                token,
                login,
                logout,
                loading,
                getToken,
            }}
        >
            {children}
        </UserProfileContext.Provider>
    );
};

export const useUserProfile = () => useContext(UserProfileContext);

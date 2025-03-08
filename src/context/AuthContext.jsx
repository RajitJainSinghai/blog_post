import { createContext, useContext, useEffect, useState } from 'react';
import { account } from '../appwrite/config';
import { ID } from 'appwrite';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      await account.createEmailSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      navigate('/');
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const register = async (email, password, name) => {
    try {
      await account.create(ID.unique(), email, password, name);
      await login(email, password);
      toast.success('Registration successful!');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      navigate('/login');
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Logout failed.');
    }
  };

  const contextData = {
    user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
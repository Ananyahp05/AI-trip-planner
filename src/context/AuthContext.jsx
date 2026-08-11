import React, { createContext, useContext, useState, useEffect } from 'react';

const USER_SESSION_KEY = 'ai_trip_planner_user';
const REGISTERED_USERS_KEY = 'ai_trip_planner_registered_users';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user session and registered user database on mount
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(REGISTERED_USERS_KEY);
      if (storedUsers) {
        setRegisteredUsers(JSON.parse(storedUsers));
      }

      const storedUser = localStorage.getItem(USER_SESSION_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to load auth data", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveRegisteredUsers = (users) => {
    setRegisteredUsers(users);
    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error("Failed to save registered users", e);
    }
  };

  const saveUserSession = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userData));
    } catch (e) {
      console.error("Failed to save session", e);
    }
  };

  // Account Registration (Sign Up)
  const signUp = (name, email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if email is already registered
    const existing = registeredUsers.find(u => u.email === cleanEmail);
    if (existing) {
      throw new Error("An account with this email already exists. Please sign in instead.");
    }

    const newUser = {
      id: Date.now().toString(),
      name: name.trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      password: password.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || cleanEmail)}`,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...registeredUsers, newUser];
    saveRegisteredUsers(updatedUsers);

    // Auto sign-in after account creation
    const sessionData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      loggedInAt: new Date().toISOString()
    };
    saveUserSession(sessionData);

    return sessionData;
  };

  // Account Sign In (Login with Credential Validation)
  const signIn = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check credentials against registered database
    const matchingUser = registeredUsers.find(
      u => u.email === cleanEmail && u.password === cleanPassword
    );

    if (!matchingUser) {
      // Check if email exists to give a specific helpful error
      const emailExists = registeredUsers.some(u => u.email === cleanEmail);
      if (emailExists) {
        throw new Error("Incorrect password. Please try again.");
      } else {
        throw new Error("No account found with this email. Please click 'Create Account' to sign up.");
      }
    }

    const sessionData = {
      id: matchingUser.id,
      name: matchingUser.name,
      email: matchingUser.email,
      avatar: matchingUser.avatar,
      loggedInAt: new Date().toISOString()
    };
    saveUserSession(sessionData);

    return sessionData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_SESSION_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signUp,
        signIn,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

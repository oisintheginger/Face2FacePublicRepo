/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useLayoutEffect } from 'react';
import { createContext, useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import getUserProfile from 'src/apis/user/getUserProfile';
// import userSignOutApi from '../apis/auth/userSignOutApi';
import { STORAGE_KEYS } from '../configs/constants';
import { User } from '../configs/interfaces';

interface IAuthContext {
  user: User | null;
  token: string | null;
  isAuthLoading: boolean;
  setAuth: ({ token, user }: { token: string; user: User }) => Promise<void>;
  setUser: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  token: null,
  isAuthLoading: true,
  setAuth: async ({ token, user }): Promise<void> => {},
  setUser: (user) => {},
  logout: () => {},
});

const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    setToken(null);
    setUser(null);
  }, []);

  //before first paint, check if token exists in storage
  useLayoutEffect(() => {
    setIsAuthLoading(true);
    const storeToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storeUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (!!storeToken && !!storeUser) {
      setToken(storeToken);
      setUser(JSON.parse(storeUser));
    } else {
      setIsAuthLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!!token) {
      getUserProfile()
        .then(({ data: { user } }) => {
          // update user profile
          setUser(user);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        })
        .catch((error) => {
          if (error.response.status === 401) {
            clearAuth();
          }
        });
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthLoading,
        setAuth: async ({ token, user }) => {
          localStorage.setItem(STORAGE_KEYS.TOKEN, token);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
          setToken(token);
          setUser(user);
        },
        setUser: (user) => {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
          setUser(user);
        },
        logout: async () => {
          try {
            // await userSignOutApi();
          } finally {
            clearAuth();
            toast.info('user logged out');
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

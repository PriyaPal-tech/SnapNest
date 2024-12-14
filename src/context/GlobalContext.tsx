import { createContext, Dispatch, FC, SetStateAction, useContext, useState } from "react";
import { userProps } from "../global/types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../global/config";
import { getToken } from "../global/userService";

type GlobalContextProps = {
  currentUser: userProps | undefined;
  setCurrentUser: Dispatch<SetStateAction<userProps | undefined>>;
  getCurrentUser: (token: string) => Promise<void>;
  userToken: string | undefined;
  setUserToken: Dispatch<SetStateAction<string | undefined>>;
  getUserToken: () => void;
};

const initGlobalContextPropsState = {
  currentUser: undefined,
  setCurrentUser: () => { },
  getCurrentUser: async () => { },
  userToken: undefined,
  setUserToken: () => { },
  getUserToken: () => { }
};

const GlobalContext = createContext<GlobalContextProps>(initGlobalContextPropsState);

const useGlobalContext = () => {
  return useContext(GlobalContext);
};

const GlobalContextProvider: FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<userProps | undefined>();
  const [userToken, setUserToken] = useState<string | undefined>();
  const getCurrentUser = async (token: string) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    const userId = payload.user_id as string;
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data() as userProps;
      setCurrentUser(userData);
    } else {
      console.log("No such user!");
    }
  };
  const getUserToken = () => {
    if (!userToken) {
      const token = getToken();
      if (token) setUserToken(token);
      return token;
    }
    return userToken;
  }
  return (
    <GlobalContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userToken,
        setUserToken,
        getCurrentUser,
        getUserToken,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContextProvider, useGlobalContext };

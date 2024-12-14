import React, { JSX, ReactNode, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Login from './components/auth/Login';
import Feed from './components/user/Feed';
import Profile from './components/user/Profile';
import { useGlobalContext } from './context/GlobalContext';
import CreatePost from './components/user/CreatePost';
import ProfileEdit from './components/user/ProfileEdit';
import ViewPost from './components/user/ViewPost';

interface ProtectedRouteProps {
    token: string | null;
    children: ReactNode;
}

export const ProtectedRoute = ({ token, children }: ProtectedRouteProps): JSX.Element => {
    if (!token) {
        return <Navigate to="/login" />;
    }
    return <>{children}</>;
};
const AppRoutes = () => {
    const { getCurrentUser, userToken, getUserToken } = useGlobalContext();
    useEffect(() => {
        console.log("userToken",userToken);
        if (userToken) {
            getCurrentUser(userToken);
        } else {
            getUserToken()
        }
    }, [userToken, getCurrentUser, getUserToken]);
    return (
        <Routes>
            <Route path="/" element={<App />}>
                {userToken ?
                    <>
                        <Route index element={<Navigate to="user/feed" />} />
                        <Route path="user/feed" element={<Feed />} />
                        <Route path="user/profile/:userId" element={<Profile />} />
                        <Route path="user/create" element={<CreatePost />} />
                        <Route path="user/profile/edit" element={<ProfileEdit />} />
                        <Route path="user/post/:postId" element={<ViewPost />} />
                    </>
                    :
                    <>
                        <Route index element={<Navigate to="login" />} />
                        <Route index path='login' element={<Login />} />
                    </>
                }
            </Route>
        </Routes>
    )
}

export default AppRoutes

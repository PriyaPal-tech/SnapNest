import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/UserProfile.css";
import { useGlobalContext } from '../../context/GlobalContext';
import { HiPencil } from "react-icons/hi";
import { updateUserDetails } from '../../db/addUsers';
import { IoMdArrowRoundBack } from 'react-icons/io';

const ProfileEdit = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string | undefined>('');
    const [userBio, setUserBio] = useState<string | undefined>('');
    const [profilePicture, setProfilePicture] = useState<string | undefined>('');
    const [coverPhoto, setCoverPhoto] = useState<string | undefined>('');
    const [loading, setLoading] = useState<boolean>(false);
    const { currentUser, getCurrentUser, userToken, getUserToken } = useGlobalContext();

    const handleSave = async () => {
        if (!currentUser?.userId) {
            console.error('User not found!');
            return;
        }
        const updatedFields = {
            userName,
            userBio,
            profilePicture,
            coverPhoto,
        };
        setLoading(true);
        try {
            await updateUserDetails(currentUser.userId, updatedFields);
            console.log('Profile updated successfully!');
            navigate('/user/profile');
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const convertToBase64 = (file: File) => {
        return new Promise<string | undefined>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };
    const handleCoverPhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setCoverPhoto(base64);
        }
    };
    const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setProfilePicture(base64);
        }
    };
    const handleBack = () => {
        window.history.back();
    };
    useEffect(() => {
        setUserName(currentUser?.userName);
        setUserBio(currentUser?.userBio);
        setProfilePicture(currentUser?.profilePicture);
        setCoverPhoto(currentUser?.coverPhoto);
    }, [currentUser])

    useEffect(() => {
        const fetchUser = async () => {
            const token = userToken || await getUserToken(); 
            if (token) {
                await getCurrentUser(token); 
            }
        };

        fetchUser();
    }, [userToken, getUserToken, getCurrentUser]);

    return (
        <div className="profile-edit-container">
            <div className="cover-photo-container">
                <img
                    src={coverPhoto || "https://via.placeholder.com/600x300"}
                    alt="Cover"
                    className="cover-photo"
                />
                <header className="create-post-header profile-back">
                    <IoMdArrowRoundBack size={24} onClick={handleBack} className='back-button me-2' />
                    <p className='create-header'>Edit Profile</p>
                </header>
                <div className="cover-edit-icon">
                    <label htmlFor="coverPhotoUpload">
                        <HiPencil size={13} />
                    </label>
                    <input
                        type="file"
                        id="coverPhotoUpload"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleCoverPhotoChange}
                    />
                </div>
            </div>
            <div className='profile-edit-info'>
                <img
                    src={profilePicture || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="profile-picture"
                />
                <div className="profile-edit-icon">
                    <label htmlFor="profilePictureUpload">
                        <HiPencil size={16} />
                    </label>
                    <input
                        type="file"
                        id="profilePictureUpload"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleProfilePictureChange}
                    />
                </div>
            </div>
            <div className="profile-edit-fields">
                <div className="field">
                    <label htmlFor="name" className="field-title">Name</label>
                    <input
                        type="text"
                        id="name"
                        className="input-field"
                        value={userName || ""}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your name"
                    />
                </div>
                <div className="field">
                    <label htmlFor="bio" className="field-title">Bio</label>
                    <textarea
                        id="bio"
                        className="textarea-field"
                        value={userBio || ""}
                        onChange={(e) => setUserBio(e.target.value)}
                        placeholder="Write something about yourself"
                        rows={2}
                    />
                </div>
            </div>
            <footer className="create-post-footer mb-3 mx-3">
                <button onClick={handleSave} className="create-button" disabled={loading}>
                    {loading ? 'SAVING...' : 'SAVE'}
                </button>
            </footer>
        </div>
    );
};

export default ProfileEdit;

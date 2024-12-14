import React, { useCallback, useEffect, useState } from 'react'
import "../../styles/UserProfile.css";
import { db } from '../../global/config';
import { doc, getDoc } from 'firebase/firestore';
import { postProps, userProps } from '../../global/types';
import { useGlobalContext } from '../../context/GlobalContext';
import { useNavigate, useParams } from 'react-router-dom';
import CreatePostButton from './CreatePostButton';
import { HiHeart } from "react-icons/hi";
import { IoMdArrowRoundBack } from 'react-icons/io';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
const Profile = () => {
  const { currentUser, getCurrentUser, userToken, getUserToken } = useGlobalContext();
  const [user, setUser] = useState<userProps | undefined>();
  const [posts, setPosts] = useState<postProps[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userId } = useParams();

  const fetchUserData = useCallback(
    async (id: string) => {
      try {
        const userDocRef = doc(db, 'users', id);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as userProps;
          setUser(userData);
          if (userData.postIds) {
            await fetchUserPosts(userData.postIds);
          }
        } else {
          console.error("User not found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }, []);

  const fetchUserPosts = async (postIds: string[]) => {
    try {
      const postPromises = postIds.map(async (postId) => {
        const postDocRef = doc(db, 'posts', postId);
        const postDoc = await getDoc(postDocRef);
        return postDoc.exists() ? (postDoc.data() as postProps) : null;
      });
      const postResults = await Promise.all(postPromises);
      setPosts(postResults.filter((post) => post !== null) as postProps[]);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  const handleCreatePost = () => {
    navigate('/user/create');
  }
  const handleBack = () => {
    window.history.back();
  };

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    } else if (currentUser) {
      setUser(currentUser);
      if (currentUser.postIds) {
        fetchUserPosts(currentUser.postIds);
      }
      setLoading(false);
    }
  }, [userId, currentUser, fetchUserData]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = userToken || getUserToken();
      if (token) {
        await getCurrentUser(token);
      }
    };

    fetchUser();
  }, [userToken]);

  const isOwnProfile = currentUser?.userId === userId;
  return (
    <>
      {loading ? (
        <div className="profile-skeleton">
          <Skeleton height={300} className="skeleton-cover-photo" />
          <div className="padding-20">
            <Skeleton width={200} height={40} className='my-2' />
          </div>
          <div className="skeleton-posts padding-20">
            <Skeleton height={20} width={100} />
            <div className="skeleton-post-grid">
              <Skeleton height={200} />

            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="profile-container">
            <div className="cover-photo-container">
              <img
                src={user?.coverPhoto || "https://via.placeholder.com/600x300"}
                alt="Cover"
                className="cover-photo"
              />
              <IoMdArrowRoundBack size={24} onClick={handleBack} className='profile-back' />
            </div>
            <div className='profile-info'>
              <img
                src={user?.profilePicture || "https://via.placeholder.com/150"}
                alt="Profile"
                className="profile-picture"
              />
              {isOwnProfile &&
                <button className="edit-profile-button" onClick={() => navigate('/user/profile/edit')}>Edit Profile</button>
              }
            </div>
            <div className="user-info">
              <h2 className="user-name">{user?.userName}</h2>
              <p className="user-bio">{user?.userBio || "Describe yourself in emojis or words — your call! 🎯✨"}</p>
            </div>
            <div className="my-posts">
              <h3 className="posts-heading">{isOwnProfile && 'My'} Posts</h3>
              <div className="posts-grid">
                {posts
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((post, index) => (
                    <div key={post.postId} className="post-card cursor-pointer" onClick={() => navigate(`/user/post/${post.postId}`)}>
                      <div className="post-image-container">
                        <div className="image-scroll-container">
                          <>
                            {post.postImages[0].includes('video') ? (
                              <video
                                src={post.postImages[0]}
                                className="post-image"
                                muted
                              />
                            ) : (
                              <img
                                src={post.postImages[0]}
                                alt={`Post Media ${index}`}
                                className="post-image"
                              />)}
                          </>
                        </div>
                        <div className="post-overlay">
                          <div className="post-caption">{post.caption}</div>
                          <div className="post-likes">
                            <HiHeart size={16} className='me-1' />
                            {post.likes}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {isOwnProfile &&
            <CreatePostButton handleCreatePost={handleCreatePost} />
          }
        </>)}
    </>
  )
}

export default Profile

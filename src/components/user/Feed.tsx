import React, { useEffect, useState, useRef } from "react";
import "../../styles/UserFeed.css";
import { useNavigate } from "react-router-dom";
import { Post, userProps } from "../../global/types";
import { useGlobalContext } from "../../context/GlobalContext";
import CreatePostButton from "./CreatePostButton";
import { collection, doc, DocumentData, getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter } from "firebase/firestore";
import { db } from "../../global/config";
import PostCard from "./PostCard";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Feed = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const { currentUser, getCurrentUser, userToken, getUserToken } = useGlobalContext();
    const [user, setUser] = useState<userProps | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const [mainLoader, setMainLoader] = useState<boolean>(true);
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const observerRef = useRef<HTMLDivElement | null>(null);
    
    const navigate = useNavigate();
    
    const fetchUserDetails = async (userId: string) => {
        if (!userId) {
            console.warn("User ID is undefined.");
            return null;
        }
        try {
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                return {
                    userName: userData.userName || "Unknown User",
                    userProfilePic: userData.profilePicture || "https://via.placeholder.com/50",
                };
            }
        } catch (error) {
            console.error("Error fetching user details: ", error);
        } finally{
            setMainLoader(false);
        }
    };

    const fetchInitialPosts = async () => {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("timestamp", "desc"), limit(20));
        try {
            const snapshot = await getDocs(q);
            const postsData = await Promise.all(
                snapshot.docs.map(async (doc) => {
                    const post = doc.data() as Post;
                    const userDetails = await fetchUserDetails(post.userId);
                    if (userDetails) {
                        return {
                            ...post,
                            ...userDetails,
                        };
                    }
                    return null;
                })
            );
            setPosts(postsData.filter((post): post is Post => post !== null));
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        } catch (error) {
            console.error("Error fetching posts: ", error);
        } finally {
            setLoading(false);
        }
    };
    const fetchMorePosts = async () => {
        if (!lastVisible) return;
        setLoading(true);
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("timestamp", "desc"), startAfter(lastVisible), limit(20));

        try {
            const snapshot = await getDocs(q);
            const postsData = await Promise.all(
                snapshot.docs.map(async (doc) => {
                    const post = doc.data() as Post;
                    const userDetails = await fetchUserDetails(post.userId);
                    if (userDetails) {
                        return {
                            ...post,
                            ...userDetails,
                        };
                    }
                    return null;
                })
            );
            setPosts((prevPosts) => [...prevPosts, ...postsData.filter((post): post is Post => post !== null)]);
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        } catch (error) {
            console.error("Error fetching more posts: ", error);
        } finally {
            setLoading(false);
        }
    };
    const handleCreatePost = () => {
        navigate('/user/create');
    }
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        if (target.isIntersecting && !loading) {
            fetchMorePosts();
        }
    };
    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });
        if (observerRef.current) observer.observe(observerRef.current);
        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [observerRef.current, loading]);
    useEffect(() => {
        setUser(currentUser);
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

    useEffect(() => {
        fetchInitialPosts();
    }, [fetchInitialPosts]);

    return (
        <>{mainLoader ? (
            <div className="profile-skeleton px-2 overflow-hidden">
              <Skeleton height={50}/>
              <div className="py-4">
                <div>
                  <Skeleton height={200} />
                  <div className="py-2"></div>
                  <Skeleton height={200} />
                  <div className="py-2"></div>
                  <Skeleton height={200} />
                </div>
              </div>
            </div>
          ) : (
        <>
            <div className="feed-container">
                <div className="feed-header" onClick={() => { navigate(`/user/profile/${currentUser?.userId}`) }}>
                    <img
                        className="picture"
                        src={user?.profilePicture || "https://via.placeholder.com/50"}
                        alt="User"
                    />
                    <div className="header-text">
                        <p className="feed-title">Welcome Back!</p>
                        <p className="feed-user-name">{user?.userName}</p>
                    </div>
                </div>

                <div className="posts-container">
                    {posts.map((post) => (
                        <PostCard key={post.postId} post={post} isClickable={true} />
                    ))}
                </div>
                <div ref={observerRef} className="loader">
                    {loading && <p>Loading more posts...</p>}
                </div>
            </div>
            <CreatePostButton handleCreatePost={handleCreatePost} />
        </>)}
        </>
    )
}

export default Feed

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Post } from '../../global/types';
import PostCard from './PostCard';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../global/config';

const ViewPost = () => {
    const { postId } = useParams();
    const [post, setPost] = useState<Post | null>(null);

    const fetchPost = async (id: string) => {
        try {
            const postDocRef = doc(db, 'posts', id);
            const postDoc = await getDoc(postDocRef);
    
            if (postDoc.exists()) {
                const postData = postDoc.data() as Post;
                const userDocRef = doc(db, 'users', postData.userId);
                const userDoc = await getDoc(userDocRef);
    
                if (userDoc.exists()) {
                    const userData = userDoc.data() as { userName: string; profilePicture: string };
                    const mergedPost = {
                        ...postData,
                        userName: userData.userName,
                        userProfilePic: userData.profilePicture,
                    };
    
                    setPost(mergedPost);
                } else {
                    console.error('User not found!');
                }
            } else {
                console.error('Post not found!');
            }
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    useEffect(() => {
        if (postId) {
            fetchPost(postId);
        }
    }, [postId]);

    if (!post) {
        return <div className="view-post-error">Loading post...</div>;
    }

    return (
        <div>
            <PostCard post={post} isClickable={false} />
        </div>
    )
}

export default ViewPost

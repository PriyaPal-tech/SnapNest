import { db } from '../global/config';
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { postProps } from '../global/types';

export const addPost = async (post: postProps) => {
    const postRef = doc(db, 'posts', post.postId); 
    const userRef = doc(db, 'users', post.userId);

    await setDoc(postRef, {
        postId: post.postId,
        caption: post.caption,
        postImages: post.postImages,
        timestamp: post.timestamp,
        likes: post.likes,
        userId: post.userId,
    });

    await updateDoc(userRef, {
        postIds: arrayUnion(post.postId),
    });
}

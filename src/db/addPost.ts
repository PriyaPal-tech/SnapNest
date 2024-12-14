import { db } from '../global/config';
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { postProps } from '../global/types';

export const addPost = async (post: postProps) => {
    const postRef = doc(db, 'posts', post.postId);
    const userRef = doc(db, 'users', post.userId);
    try {
        await setDoc(postRef, post);
        await updateDoc(userRef, {
            postIds: arrayUnion(post.postId),
        });
    } catch (error) {
        console.error('first error', error)
    }
}

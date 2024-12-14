import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../global/config';
import { userProps } from '../global/types';

export const checkUserExists = async (userId: string) => {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists();
};

export const addUser = async (user: userProps) => {
    const userRef = doc(db, 'users', user.userId);
    await setDoc(userRef, user);
}

export const updateUserDetails = async (userId: string, updatedFields: Partial<userProps>) => {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, updatedFields, { merge: true });
};

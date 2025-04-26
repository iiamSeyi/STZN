import { doc, setDoc, getDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { getDocument, updateDocument } from './db-operations';
import { validateUserData, validateProfileUpdates } from './validation';


export async function createUserDocument(user) {
  validateUserData(user);
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const userData = {
        displayName: user.displayName,
        email: user.email,
        photoURL: await user.photoURL ||'/public/download.png' ,
        createdAt: new Date(),
        updatedAt: new Date(),
        totalFlows: 0,
        treesSpared: 0,
        tournaments: []
      };
      
      await setDoc(userRef, userData);
    }
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
}

export async function updateUserStats(userId) {
    try {
        // Get user reference
        const userRef = doc(db, 'users', userId);
        
        // Count total flows for this user from flows collection
        const flowsRef = collection(db, 'flows');
        const q = query(flowsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        // Calculate total flows and pages
        const totalFlows = querySnapshot.size;
        let totalPages = 0;
        querySnapshot.forEach(doc => {
            const flow = doc.data();
            totalPages += flow.pageCount || 1;
            
        });

        // Update user document with actual counts
        await updateDoc(userRef, {
            totalFlows: totalFlows,
            treesSpared: totalPages * 0.0001,
            updatedAt: new Date()
        });

        return { totalFlows, totalPages };
    } catch (error) {
        console.error('Error updating user stats:', error);
        throw error;
    }
}

export async function getUserProfile(userId) {
  try {
    return await getDocument('users', userId);
  } catch (error) {
    if (error.message.includes('Document not found')) {
      return null;
    }
    console.error('Error getting user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(userId, updates) {
  try {
    validateProfileUpdates(updates);
    await updateDocument('users', userId, updates);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}
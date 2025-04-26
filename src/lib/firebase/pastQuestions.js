import { collection, addDoc, updateDoc, doc, deleteDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from './config';
import { NotFoundError } from './errors';

export const uploadPastQuestion = async (questionData, userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }

    try {
        const timestamp = new Date().toISOString();
        const newQuestion = {
            ...questionData,
            uploadedBy: userId,
            uploadedAt: timestamp,
            updatedAt: timestamp
        };
        const questionRef = await addDoc(collection(db, 'pastQuestions'), newQuestion);
        return {
            id: questionRef.id,
            ...newQuestion
        };
    } catch (error) {
        console.error('Error uploading past question:', error);
        throw error;
    }
};

export const getPastQuestions = async (filters = {}) => {
    try {
        let q = query(collection(db, 'pastQuestions'));

        // Apply filters
        if (filters.course) {
            q = query(q, where('course', '==', filters.course));
        }
        if (filters.year) {
            q = query(q, where('year', '==', filters.year));
        }

        q = query(q, orderBy('uploadedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching past questions:', error);
        throw error;
    }
};

export const updatePastQuestion = async (questionId, updatedData, userId) => {
    try {
        const questionRef = doc(db, 'pastQuestions', questionId);
        const questionSnap = await getDoc(questionRef);

        if (!questionSnap.exists()) {
            throw new NotFoundError('Past question not found');
        }

        const questionData = questionSnap.data();
        if (questionData.uploadedBy !== userId) {
            throw new Error('Only the owner can update this past question');
        }

        const updatedQuestion = {
            ...questionData,
            ...updatedData,
            updatedAt: new Date()
        };

        await updateDoc(questionRef, updatedQuestion);
        return {
            id: questionId,
            ...updatedQuestion
        };
    } catch (error) {
        console.error('Error updating past question:', error);
        throw error;
    }
};

export const deletePastQuestion = async (questionId, userId) => {
    try {
        const questionRef = doc(db, 'pastQuestions', questionId);
        const questionSnap = await getDoc(questionRef);

        if (!questionSnap.exists()) {
            throw new NotFoundError('Past question not found');
        }

        const questionData = questionSnap.data();
        if (questionData.uploadedBy !== userId) {
            throw new Error('Only the owner can delete this past question');
        }

        await deleteDoc(questionRef);
        return true;
    } catch (error) {
        console.error('Error deleting past question:', error);
        throw error;
    }
};

export const getFilteredPastQuestions = async (userId, filters = {}) => {
    try {
        const conditions = [
            { field: 'uploadedBy', operator: '==', value: userId }
        ];

        if (filters.course) {
            conditions.push({ field: 'course', operator: '==', value: filters.course });
        }
        if (filters.year) {
            conditions.push({ field: 'year', operator: '==', value: filters.year });
        }

        const sortOptions = { field: 'uploadedAt', direction: 'desc' };
        return await queryDocuments('pastQuestions', conditions, sortOptions);
    } catch (error) {
        console.error('Error getting filtered past questions:', error);
        throw error;
    }
};
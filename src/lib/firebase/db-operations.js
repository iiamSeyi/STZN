import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  updateDoc,
  limit,
} from "firebase/firestore";
import { db } from "./config";
import { NotFoundError, ValidationError } from "./errors";
import {
    validatePastQuestionData,
    validatePastQuestionUpdates,
} from "./validation";
import { uploadFileToStorage } from "./storage-utils";
import { updateUserStats } from "./users";

export async function createDocument(collectionName, data) {
  try {
    // if (collectionName === 'pastQuestions') {
    //     validatePastQuestionData(data);
    //   }

    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
}

export async function getDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new NotFoundError(`Document not found in ${collectionName}`);
    }

    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
}

export async function updateDocument(collectionName, docId, updates) {
  try {
    if (collectionName === 'pastQuestions') {
        validatePastQuestionUpdates(updates);
      }

    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
}

export async function deleteDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
}

export async function queryDocuments(
  collectionName,
  conditions = [],
  orderByField = "createdAt",
  orderDirection = "desc",
  limitCount = null
) {
  try {
    // Create base query
    let baseQuery = collection(db, collectionName);
    let queryConstraints = [];

    // Add where clauses
    if (Array.isArray(conditions) && conditions.length > 0) {
      conditions.forEach((condition) => {
        if (condition?.field && condition?.operator && condition?.value !== undefined) {
          queryConstraints.push(where(condition.field, condition.operator, condition.value));
        }
      });
    }

    // Add orderBy with validation
    if (orderByField && typeof orderByField === 'string' && orderByField.trim() !== '') {
      queryConstraints.push(orderBy(orderByField, orderDirection));
    }

    // Add limit
    if (limitCount && typeof limitCount === 'number') {
      queryConstraints.push(limit(limitCount));
    }

    // Construct final query
    const finalQuery = query(baseQuery, ...queryConstraints);

    // Execute query
    const querySnapshot = await getDocs(finalQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error querying documents in ${collectionName}:`, error);
    throw error;
  }
}


export async function batchUpdate(collectionName, updates) {
  // Implementation for batch updates
}

export async function uploadItem(file, metadata, userId) {
  try {
    // Upload image to Storage
    const storagePath = `name/${userId}/${file.name}`; // replace name with the collection name
    const downloadURL = await uploadFileToStorage(file, storagePath);

    // sample document
    const itemData = {
      userId,
      fileName: file.name,
      imageUrl: downloadURL,
      name: metadata.name,
      quantity: metadata.quantity || 1,
      category: metadata.category || "Uncategorized",
      notes: metadata.notes || "",
      expiryDate: metadata.expiryDate || null,
      detectedLabels: [], // We'll update this after object detection
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add inventory document
    const result = await createDocument("name", itemData); // replace name with the collection name

    // Update user stats
    await updateUserStats(userId);

    return result;
  } catch (error) {
    console.error("Error uploading item:", error);
    throw error;
  }
}

export const updateItem = async (itemId, updatedData) => {
  try {
    const itemRef = doc(db, "inventory", itemId);
    await updateDoc(itemRef, {
      ...updatedData,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error("Error updating inventory item:", error);
    throw error;
  }
};

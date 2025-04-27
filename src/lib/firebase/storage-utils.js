import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

export async function uploadFileToStorage(file, path) {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error('Error uploading file to storage:', error);
    throw error;
  }
}

export async function deleteFileFromStorage(path) {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file from storage:', error);
    throw error;
  }
}

export async function downloadFileFromStorage(path) {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    
    // Create temporary link to trigger download
    const link = document.createElement('a');
    link.href = url;
    // Extract filename from path or provide a default name
    const fileName = path.split('/').pop() || 'downloaded-file';
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return url;
  } catch (error) {
    console.error('Error downloading file from storage:', error);
    throw error;
  }
}

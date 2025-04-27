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

// export async function downloadFileFromStorage(path) {
//   try {
//     const storageRef = ref(storage, path);
//     const url = await getDownloadURL(storageRef);
    
//     // Create temporary link to trigger download
//     const link = document.createElement('a');
//     link.href = url;
//     // Extract filename from path or provide a default name
//     const fileName = path.split('/').pop() || 'downloaded-file';
//     link.setAttribute('download', fileName);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
    
//     return url;
//   } catch (error) {
//     console.error('Error downloading file from storage:', error);
//     throw error;
//   }
// }

// export const downloadFileFromStorage = async (path) => {
//   try {
//     // Get a reference to the file
//     const storageRef = ref(storage, path);
    
//     // Get the download URL using Firebase's SDK
//     const url = await getDownloadURL(storageRef);
    
//     // Create a temporary link element
//     const link = document.createElement('a');
//     link.href = url;
    
//     // Extract filename from path or use a default name
//     const fileName = path.split('/').pop() || 'download';
//     link.setAttribute('download', fileName);
    
//     // Append to document, click, and cleanup
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
    
//     return true;
//   } catch (error) {
//     console.error('Error downloading file:', error);
//     throw error;
//   }
// };



export async function getFileFromStorage(path) {
    try {
      const storageRef = ref(storage, path);
      const url = await getDownloadURL(storageRef);
      
    //   // Fetch the file as a blob
    //   const response = await fetch(url);
    //   const blob = await response.blob();
      
    //   // Get filename from path
    //   const filename = path.split('/').pop();
      
    //   // Create blob URL
    //   const blobUrl = window.URL.createObjectURL(blob);
      
    //   // Create temporary link
    //   const link = document.createElement('a');
    //   link.href = blobUrl;
    //   link.download = filename; // Set the file name for download
      
    //   // Append link, trigger click, and cleanup
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
      
    //   // Cleanup blob URL
    //   window.URL.revokeObjectURL(blobUrl);
      

    const link = document.createElement('a');
      link.href = url;
      link.target = '_blank'; // This makes it open in new tab
      link.rel = 'noopener noreferrer'; // Security best practice
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Error getting file from storage:', error);
      throw error;
    }
  }
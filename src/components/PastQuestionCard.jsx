import { useState } from "react";
import { deleteDocument } from "../lib/firebase/db-operations";
import { FiDownload, FiEdit2 } from "react-icons/fi";
import EditPastQuestion from "./EditPastQuestion";
import { getFileFromStorage } from "../lib/firebase/storage-utils";
import { updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase/config";

function PastQuestionCard({ question, onDelete, isOwner }) {
  const [showFullImage, setShowFullImage] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (formData) => {
    setIsLoading(true);
    try {
      let updatedData = {
        title: formData.title,
        course: formData.course,
        year: formData.year,
      };

      if (formData.file) {
        const timestamp = Date.now();
        const filename = `${formData.file.name}-${timestamp}`;
        const storageRef = ref(storage, `past-questions/${filename}`);

        await uploadBytes(storageRef, formData.file);
        const newImageUrl = await getDownloadURL(storageRef);
        updatedData.imageUrl = newImageUrl;
      }

      await updateDoc(doc(db, "pastQuestions", question.id), updatedData);
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating question:", error);
      alert("Failed to update. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <EditPastQuestion
        question={question}
        onUpdate={handleUpdate}
        onCancel={() => setIsEditing(false)}
        isLoading={isLoading}
      />
    );
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this past question?")) {
      try {
        await deleteDocument("pastQuestions", question.id);
        onDelete(question.id);
      } catch (error) {
        console.error("Error deleting past question:", error);
        alert("Error deleting past question. Please try again.");
      }
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await getFileFromStorage(question.imageUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const isPDF = question.imageUrl?.toLowerCase().includes(".pdf");

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative aspect-w-16 aspect-h-9">
        {isPDF ? (
          <embed
            src={`${question.imageUrl}#view=FitH`}
            type="application/pdf"
            className="w-full h-48 cursor-pointer"
            onClick={() => setShowFullImage(true)}
          />
        ) : (
          <img
            src={question.imageUrl}
            alt={question.title}
            className="object-cover w-full h-48 cursor-pointer"
            onClick={() => setShowFullImage(true)}
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{question.title}</h3>
        <p className="text-gray-600">Course: {question.course}</p>
        <p className="text-gray-600">Year: {question.year}</p>
        <p className="text-gray-500 text-sm">
          Uploaded on: {new Date(question.uploadedAt).toLocaleDateString()}
        </p>
        <div className="mt-2 flex gap-2 items-center">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-md 
              ${
                isDownloading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
              } 
              text-white transition-colors`}
          >
            <FiDownload className="w-4 h-4" />
            {isDownloading ? "Downloading..." : "Download"}
          </button>

          {isOwner && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                <FiEdit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {showFullImage && !isPDF && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowFullImage(false)}
        >
          <div className="max-w-4xl max-h-full p-4">
            <img
              src={question.imageUrl}
              alt={question.title}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <div className="mt-4 flex justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                disabled={isDownloading}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md 
                  ${
                    isDownloading
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
                  } 
                  text-white transition-colors`}
              >
                <FiDownload className="w-5 h-5" />
                {isDownloading ? "Downloading..." : "Download Full Resolution"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PastQuestionCard;

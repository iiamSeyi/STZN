// import { useState } from 'react';
// import { deleteDocument } from '../lib/firebase/db-operations';

// function PastQuestionCard({ question, onDelete, isOwner }) {
//   const [showFullImage, setShowFullImage] = useState(false);

//   const handleDelete = async () => {
//     if (window.confirm('Are you sure you want to delete this past question?')) {
//       try {
//         await deleteDocument('pastQuestions', question.id);
//         onDelete(question.id);
//       } catch (error) {
//         console.error('Error deleting past question:', error);
//         alert('Error deleting past question. Please try again.');
//       }
//     }
//   };

//   isPDF = question.imageUrl?.toLowerCase().includes('.pdf');

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden">
//       <div className="relative aspect-w-16 aspect-h-9">
//       {isPDF && (
//           <div className="absolute inset-0 flex items-center justify-center">
//             <embed
//             src={`${question.imageUrl}#view=FitH`}
//             type="application/pdf"
//             className="w-full h-48 cursor-pointer"
//             onClick={() => setShowFullImage(true)}
//             />
//           </div>
//         )}
//         {!isPDF && (
//           <img
//           src={question.imageUrl}
//           alt={question.title}
//           className="object-cover w-full h-48 cursor-pointer"
//           onClick={() => setShowFullImage(true)}
//         />
//         )}
//         <img
//           src={question.imageUrl}
//           alt={question.title}
//           className="object-cover w-full h-48 cursor-pointer"
//           onClick={() => setShowFullImage(true)}
//         />
//       </div>
//       <div className="p-4">
//         <h3 className="text-lg font-semibold">{question.title}</h3>
//         <p className="text-gray-600">Course: {question.course}</p>
//         <p className="text-gray-600">Year: {question.year}</p>
//         <p className="text-gray-500 text-sm">
//           Uploaded on: {new Date(question.uploadedAt).toLocaleDateString()}
//         </p>
//         {isOwner && (
//           <button
//             onClick={handleDelete}
//             className="mt-2 text-red-600 hover:text-red-800"
//           >
//             Delete
//           </button>
//         )}
//       </div>

//       {showFullImage && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
//           onClick={() => setShowFullImage(false)}
//         >
//           <div className="max-w-4xl max-h-full p-4">
//             <img
//               src={question.imageUrl}
//               alt={question.title}
//               className="max-w-full max-h-[90vh] object-contain"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PastQuestionCard;






import { useState } from 'react';
import { deleteDocument } from '../lib/firebase/db-operations';

function PastQuestionCard({ question, onDelete, isOwner }) {
  const [showFullImage, setShowFullImage] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this past question?')) {
      try {
        await deleteDocument('pastQuestions', question.id);
        onDelete(question.id);
      } catch (error) {
        console.error('Error deleting past question:', error);
        alert('Error deleting past question. Please try again.');
      }
    }
  };

  const isPDF = question.imageUrl?.toLowerCase().includes('.pdf');

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
        {isOwner && (
          <button
            onClick={handleDelete}
            className="mt-2 text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        )}
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
          </div>
        </div>
      )}
    </div>
  );
}

export default PastQuestionCard;
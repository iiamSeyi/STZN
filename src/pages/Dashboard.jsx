// import { useState, useEffect } from 'react';
// import { queryDocuments } from '../lib/firebase/db-operations';
// import { auth } from '../lib/firebase/config';
// import PastQuestionUpload from '../components/PastQuestionUpload';
// import PastQuestionCard from '../components/PastQuestionCard';

// function Dashboard() {
//   const [pastQuestions, setPastQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchPastQuestions();
//   }, []);

//   const fetchPastQuestions = async () => {
//     try {
//       const conditions = [['uploadedBy', '==', auth.currentUser.uid]];
//       const questions = await queryDocuments('pastQuestions', conditions, {
//         field: 'uploadedAt',
//         direction: 'desc'
//       });
//       setPastQuestions(questions);
//     } catch (error) {
//       console.error('Error fetching past questions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNewQuestion = () => {
//     fetchPastQuestions();
//   };

//   const handleQuestionDeleted = (questionId) => {
//     setPastQuestions((prev) => prev.filter((q) => q.id !== questionId));
//   };

//   if (loading) {
//     return <div className="text-center py-8">Loading...</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Dashboard</h1>
//       </div>

//       <div className="space-y-6">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4">Upload New Past Question</h2>
//           <PastQuestionUpload onSubmit={handleNewQuestion} />
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4">My Past Questions</h2>
//           {loading ? (
//             <div className="text-center py-4">Loading...</div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {pastQuestions.map((question) => (
//                 <PastQuestionCard
//                   key={question.id}
//                   question={question}
//                   onDelete={handleQuestionDeleted}
//                   isOwner={true}
//                 />
//               ))}
//               {pastQuestions.length === 0 && (
//                 <p className="col-span-full text-center text-gray-500">
//                   No past questions found
//                 </p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

// import { useState, useEffect } from 'react';
// import { queryDocuments } from '../lib/firebase/db-operations';
// import { auth } from '../lib/firebase/config';
// import PastQuestionUpload from '../components/PastQuestionUpload';
// import PastQuestionCard from '../components/PastQuestionCard';

// function Dashboard() {
//   const [pastQuestions, setPastQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchPastQuestions();
//   }, []);

//   const fetchPastQuestions = async () => {
//     try {
//       const conditions = [['uploadedBy', '==', auth.currentUser.uid]];
//       const questions = await queryDocuments('pastQuestions', conditions, {
//         field: 'uploadedAt',
//         direction: 'desc'
//       });
//       setPastQuestions(questions);
//     } catch (error) {
//       console.error('Error fetching past questions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNewQuestion = () => {
//     fetchPastQuestions();
//   };

//   const handleQuestionDeleted = (questionId) => {
//     setPastQuestions((prev) => prev.filter((q) => q.id !== questionId));
//   };

//   if (loading) {
//     return <div className="text-center py-8">Loading...</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold">My Dashboard</h1>
//       <PastQuestionUpload onSubmit={handleNewQuestion} />
//       <div className="space-y-6">
//         <h2 className="text-xl font-semibold mb-4">My Past Questions</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {pastQuestions.map((question) => (
//             <PastQuestionCard
//               key={question.id}
//               question={question}
//               onDelete={handleQuestionDeleted}
//               isOwner={true}
//             />
//           ))}
//           {pastQuestions.length === 0 && (
//             <p className="col-span-full text-center text-gray-500">
//               No past questions found
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import { useState, useEffect } from "react";
import { queryDocuments } from "../lib/firebase/db-operations";
import { auth } from "../lib/firebase/config";
import PastQuestionUpload from "../components/PastQuestionUpload";
import PastQuestionCard from "../components/PastQuestionCard";

function Dashboard() {
  const [pastQuestions, setPastQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPastQuestions();
  }, []);

  const fetchPastQuestions = async () => {
    try {
      const conditions = [["uploadedBy", "==", auth.currentUser.uid]];
      const questions = await queryDocuments(
        "pastQuestions",
        conditions,
        "createdAt",
        "desc"
      );
      setPastQuestions(questions);
    } catch (error) {
      console.error("Error fetching past questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewQuestion = () => {
    fetchPastQuestions();
    setIsModalOpen(false); // Close the modal after uploading
  };

  const handleQuestionDeleted = (questionId) => {
    setPastQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">My Dashboard</h1>
      <button
        onClick={toggleModal}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Upload New Past Question
      </button>

      <div className="space-y-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">My Past Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastQuestions.map((question) => (
            <PastQuestionCard
              key={question.id}
              question={question}
              onDelete={handleQuestionDeleted}
              isOwner={true}
            />
          ))}
          {pastQuestions.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No past questions found
            </p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Upload Past Question</h2>
            <PastQuestionUpload onSubmit={handleNewQuestion} />
            <button
              onClick={toggleModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

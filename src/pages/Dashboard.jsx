// Dashboard.jsx
import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "../lib/firebase/config";
import PastQuestionUpload from "../components/PastQuestionUpload";
import PastQuestionCard from "../components/PastQuestionCard";

function Dashboard() {
  const [pastQuestions, setPastQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserPastQuestions = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "pastQuestions"),
          where("uploadedBy", "==", auth.currentUser.uid),
          orderBy("uploadedAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const questions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPastQuestions(questions);
      } catch (error) {
        console.error("Error fetching past questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPastQuestions();
  }, [auth.currentUser]);

  const handleNewQuestion = async () => {
    if (auth.currentUser) {
      try {
        const q = query(
          collection(db, "pastQuestions"),
          where("uploadedBy", "==", auth.currentUser.uid),
          orderBy("uploadedAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const questions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPastQuestions(questions);
      } catch (error) {
        console.error("Error refreshing questions:", error);
      }
    }
    setIsModalOpen(false); // Close modal after upload
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

  if (!auth.currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Please log in to view your dashboard
          </h1>
          <p className="text-gray-600">
            You need to be logged in to upload and manage your past questions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">My Dashboard</h1>

      <button
        onClick={toggleModal}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
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

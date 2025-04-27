// pages/SavedQuestionsPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiX, FiArrowLeft, FiDownload, FiTrash2 } from "react-icons/fi";

const QuestionCard = ({ question, index }) => (
  <div className="bg-white p-4 rounded-lg shadow mb-2 hover:shadow-md transition-shadow">
    <div className="space-y-3">
      <div className="flex items-start">
        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
          {index + 1}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs px-2 py-1 rounded ${
                question.type === "MC"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {question.type === "MC" ? "Multiple Choice" : "Open Ended"}
            </span>
          </div>
          <p className="flex-1">{question.question || question}</p>
        </div>
      </div>
      {question.options && (
        <div className="ml-8 space-y-2">
          {question.options.map((option, optIndex) => (
            <div
              key={optIndex}
              className={`p-2 rounded-lg ${
                question.correctAnswer === option[0]
                  ? "bg-green-100 border border-green-200"
                  : "bg-gray-50"
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
      {question.explanation && (
        <div className="ml-8 mt-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Explanation:</span>{" "}
            {question.explanation}
          </p>
        </div>
      )}
      {question.modelAnswer && (
        <div className="ml-8 mt-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Model Answer:</span>{" "}
            {question.modelAnswer}
          </p>
        </div>
      )}
    </div>
  </div>
);

const SavedQuestionsPage = () => {
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [questionTypeFilter, setQuestionTypeFilter] = useState("all");

  useEffect(() => {
    const saved = localStorage.getItem("savedQuestions");
    if (saved) {
      setSavedQuestions(JSON.parse(saved));
    }
  }, []);

  const deleteSavedQuestions = (id) => {
    if (window.confirm("Are you sure you want to delete these questions?")) {
      const updatedSavedQuestions = savedQuestions.filter(
        (set) => set.id !== id
      );
      setSavedQuestions(updatedSavedQuestions);
      localStorage.setItem(
        "savedQuestions",
        JSON.stringify(updatedSavedQuestions)
      );
      if (selectedSet?.id === id) {
        setSelectedSet(null);
      }
    }
  };

  const exportQuestions = (questionSet) => {
    const dataStr = JSON.stringify(questionSet, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `questions-${questionSet.document}-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/gemini-chat"
              className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
            >
              <FiArrowLeft />
              <span>Back to Chat</span>
            </Link>
            <h1 className="text-2xl font-semibold">Saved Questions</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Question Sets Sidebar */}
          <div className="md:col-span-1 space-y-4">
            <h2 className="font-medium text-lg mb-4">Question Sets</h2>
            {savedQuestions.map((set) => (
              <div
                key={set.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedSet?.id === set.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setSelectedSet(set)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{set.document}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(set.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {set.questions.length} questions
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportQuestions(set);
                      }}
                      className="text-gray-500 hover:text-blue-500"
                      title="Export questions"
                    >
                      <FiDownload />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSavedQuestions(set.id);
                      }}
                      className="text-gray-500 hover:text-red-500"
                      title="Delete questions"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {savedQuestions.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No saved questions yet
              </p>
            )}
          </div>

          {/* Selected Question Set Display */}
          <div className="md:col-span-3">
            {selectedSet ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">
                    {selectedSet.document}
                  </h2>
                  <p className="text-gray-500">
                    Created on{" "}
                    {new Date(selectedSet.timestamp).toLocaleDateString()}
                  </p>
                </div>

                {/* Question Type Filter */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setQuestionTypeFilter("all")}
                      className={`px-3 py-1 rounded ${
                        questionTypeFilter === "all"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      All Questions
                    </button>
                    <button
                      onClick={() => setQuestionTypeFilter("MC")}
                      className={`px-3 py-1 rounded ${
                        questionTypeFilter === "MC"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      Multiple Choice
                    </button>
                    <button
                      onClick={() => setQuestionTypeFilter("OE")}
                      className={`px-3 py-1 rounded ${
                        questionTypeFilter === "OE"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      Open Ended
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedSet.questions
                    .filter(
                      (q) =>
                        questionTypeFilter === "all" ||
                        q.type === questionTypeFilter
                    )
                    .map((question, index) => (
                      <QuestionCard
                        key={index}
                        question={question}
                        index={index}
                      />
                    ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
                Select a question set to view its contents
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedQuestionsPage;

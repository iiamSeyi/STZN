// pages/SavedQuestionsPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiX, FiArrowLeft, FiDownload, FiTrash2 } from "react-icons/fi";

const QuestionCard = ({ question, index }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-2 hover:shadow-md transition-shadow">
    <div className="space-y-3">
      <div className="flex items-start">
        <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
          {index + 1}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs px-2 py-1 rounded ${
                question.type === "MC"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              }`}
            >
              {question.type === "MC" ? "Multiple Choice" : "Open Ended"}
            </span>
          </div>
          <p className="flex-1 text-gray-800 dark:text-gray-200">
            {question.question || question}
          </p>
        </div>
      </div>
      {question.options && (
        <div className="ml-8 space-y-2">
          {question.options.map((option, optIndex) => (
            <div
              key={optIndex}
              className={`p-2 rounded-lg ${
                question.correctAnswer === option[0]
                  ? "bg-green-100 dark:bg-green-800 border border-green-200 dark:border-green-700"
                  : "bg-gray-50 dark:bg-gray-700"
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
      {question.explanation && (
        <div className="ml-8 mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Explanation:</span>{" "}
            {question.explanation}
          </p>
        </div>
      )}
      {question.modelAnswer && (
        <div className="ml-8 mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/gemini-chat"
              className="flex items-center gap-2 text-purple-500 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300"
            >
              <FiArrowLeft />
              <span>Back to Chat</span>
            </Link>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Saved Questions
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Question Sets Sidebar */}
          <div className="md:col-span-1 space-y-4">
            <h2 className="font-medium text-lg mb-4 text-gray-800 dark:text-gray-200">
              Question Sets
            </h2>
            {savedQuestions.map((set) => (
              <div
                key={set.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedSet?.id === set.id
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900"
                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500"
                }`}
                onClick={() => setSelectedSet(set)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      {set.document}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(set.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {set.questions.length} questions
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportQuestions(set);
                      }}
                      className="text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-300"
                      title="Export questions"
                    >
                      <FiDownload />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSavedQuestions(set.id);
                      }}
                      className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-300"
                      title="Delete questions"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {savedQuestions.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No saved questions yet
              </p>
            )}
          </div>

          {/* Selected Question Set Display */}
          <div className="md:col-span-3">
            {selectedSet ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {selectedSet.document}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
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
                          ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white"
                          : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      All Questions
                    </button>
                    <button
                      onClick={() => setQuestionTypeFilter("MC")}
                      className={`px-3 py-1 rounded ${
                        questionTypeFilter === "MC"
                          ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white"
                          : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Multiple Choice
                    </button>
                    <button
                      onClick={() => setQuestionTypeFilter("OE")}
                      className={`px-3 py-1 rounded ${
                        questionTypeFilter === "OE"
                          ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white"
                          : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
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
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center text-gray-500 dark:text-gray-400">
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

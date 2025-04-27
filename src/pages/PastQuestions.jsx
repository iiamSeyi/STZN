// src/components/PastQuestions.jsx
import { useState, useEffect, useCallback } from "react";
import { queryDocuments } from "../lib/firebase/db-operations";
import PastQuestionCard from "../components/PastQuestionCard";
import FilterBar from "../components/FilterBar";

function PastQuestions() {
  const [pastQuestions, setPastQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    course: "",
    year: "",
    title: "",
    uploadDateStart: "",
    uploadDateEnd: "",
  });

  const fetchPastQuestions = useCallback(async (filtersToApply) => {
    try {
      setLoading(true);
      setError(null);

      // Create conditions array only for non-empty values
      const conditions = Object.entries(filtersToApply)
        .filter(([_, value]) => value && value.trim() !== "")
        .map(([field, value]) => ({
          field,
          operator: "==",
          value: value.trim(),
        }));

      console.log("Applying filters with conditions:", conditions);

      const questions = await queryDocuments(
        "pastQuestions",
        conditions,
        "createdAt",
        "desc"
      );

      setPastQuestions(questions);
    } catch (error) {
      console.error("Error fetching past questions:", error);
      setError("Failed to fetch past questions. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPastQuestions(activeFilters);
  }, []);

  const handleFilterChange = (field, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    fetchPastQuestions(activeFilters);
  };

  const handleClearFilters = () => {
    setActiveFilters({
      course: "",
      year: "",
      title: "",
      uploadDateStart: "",
      uploadDateEnd: "",
    });
    fetchPastQuestions({
      course: "",
      year: "",
      title: "",
      uploadDateStart: "",
      uploadDateEnd: "",
    });
  };

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
        <button
          onClick={() => fetchPastQuestions(activeFilters)}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-md hover:from-purple-700 hover:to-purple-900 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Past Questions</h1>

      <FilterBar
        filters={activeFilters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
      />

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading past questions...</p>
        </div>
      ) : (
        <>
          {pastQuestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastQuestions.map((question) => (
                <PastQuestionCard
                  key={question.id}
                  question={question}
                  isOwner={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No past questions found that match the filters.
              </p>
              <button
                onClick={() => handleClearFilters()}
                className="mt-4 text-purple-500 hover:text-purple-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PastQuestions;

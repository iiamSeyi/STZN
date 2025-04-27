import { useState, useEffect, useCallback } from 'react';
import { queryDocuments } from '../lib/firebase/db-operations';
import PastQuestionCard from '../components/PastQuestionCard';
import FilterBar from '../components/FilterBar';

function PastQuestions() {
  const [pastQuestions, setPastQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    course: '',
    year: '',
  });

  const fetchPastQuestions = useCallback(async () => {
    try {
      // Build conditions as objects with field, operator, value
      let conditions = [];
      if (filters.course.trim()) {
        conditions.push({ field: 'course', operator: '==', value: filters.course });
      }
      if (filters.year.trim()) {
        conditions.push({ field: 'year', operator: '==', value: filters.year });
      }
      console.log('Conditions:', conditions); // Debugging

      const questions = await queryDocuments('pastQuestions', conditions, 'uploadedAt', 'desc');

      console.log('Fetched questions:', questions); // Debugging
      setPastQuestions(questions);
    } catch (error) {
      console.error('Error fetching past questions:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPastQuestions();
  }, [fetchPastQuestions]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value, // Dynamically update the filter field
    }));
  };

  const applyFilters = () => {
    setLoading(true);
    fetchPastQuestions();
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Past Questions</h1>
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={applyFilters}
      />

      {pastQuestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastQuestions.map((question) => (
            <PastQuestionCard key={question.id} question={question} isOwner={false} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No past questions found that match the filters used.
        </div>
      )}
    </div>
  );
}

export default PastQuestions;
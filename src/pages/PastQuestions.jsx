import { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchPastQuestions();
  }, [filters]);

  const fetchPastQuestions = async () => {
    try {
      let conditions = [];
      if (filters.course) {
        conditions.push(['course', '==', filters.course]);
      }
      if (filters.year) {
        conditions.push(['year', '==', filters.year]);
      }

      const questions = await queryDocuments('pastQuestions', conditions, {
        field: 'uploadedAt',
        direction: 'desc',
      });
      setPastQuestions(questions);
    } catch (error) {
      console.error('Error fetching past questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
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
      <FilterBar filters={filters} onFilterChange={handleFilterChange} onApplyFilters={applyFilters} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pastQuestions.map((question) => (
          <PastQuestionCard
            key={question.id}
            question={question}
            isOwner={false}
          />
        ))}
        {pastQuestions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No past questions found
          </div>
        )}
      </div>
    </div>
  );
}

export default PastQuestions;
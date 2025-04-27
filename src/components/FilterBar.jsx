
// import React from 'react';
import PropTypes from 'prop-types';
import { FiFilter } from 'react-icons/fi';

const FilterBar = ({ filters, onFilterChange, onApplyFilters }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg mb-6 transition-all duration-200">
      {/* Filter Header */}
      <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
        <div className="flex items-center space-x-2">
          <FiFilter className="text-indigo-600" />
          <h3 className="font-semibold text-gray-700">Filter Past Questions</h3>
        </div>
      </div>

      {/* Filter Content */}
      <div className="p-4 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Course Filter */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              Course
            </label>
            <input
              type="text"
              name="course"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter course name"
              value={filters.course}
              onChange={onFilterChange}
            />
          </div>

          {/* Year Filter */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              Year
            </label>
            <input
              type="text"
              name="year"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter year"  
              value={filters.year}
              onChange={onFilterChange}
            />
          </div>
        </div>

        {/* Apply Filters Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onApplyFilters}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
FilterBar.propTypes = {
  filters: PropTypes.shape({
    course: PropTypes.string,
    year: PropTypes.string,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
};

export default FilterBar;

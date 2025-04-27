// src/components/FilterBar.jsx
import React, { useState, useCallback } from "react";
import { FiFilter, FiCalendar, FiBook } from "react-icons/fi";
import PropTypes from "prop-types";

const FilterBar = ({ filters, onFilterChange, onApplyFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate years from 2000 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) =>
    (currentYear - i).toString()
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (field, value) => {
      onFilterChange(field, value);
    },
    [onFilterChange]
  );

  // Clear all filters
  const handleClearFilters = () => {
    const emptyFilters = {
      course: "",
      year: "",
      title: "",
      uploadDateStart: "",
      uploadDateEnd: "",
    };
    Object.keys(emptyFilters).forEach((field) => {
      onFilterChange(field, "");
    });
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(
    (value) => value && value.trim() !== ""
  ).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6 transition-all duration-200">
      {/* Filter Header */}
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <FiFilter className="text-purple-500" />
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">
            Filter Past Questions
          </h3>
          {activeFilterCount > 0 && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
              {activeFilterCount} Active Filter
              {activeFilterCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <button
          className={`p-2 rounded-full transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Expandable Filter Content */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Course Filter */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200">
                <FiBook className="mr-2 text-purple-500" />
                Course Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 dark:placeholder-gray-400"
                placeholder="Enter course name"
                value={filters.course}
                onChange={(e) => handleFilterChange("course", e.target.value)}
              />
            </div>

            {/* Year Filter */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200">
                <FiCalendar className="mr-2 text-purple-500" />
                Year
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700"
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Date Range */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200">
                <FiCalendar className="mr-2 text-purple-500" />
                Upload Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700"
                  value={filters.uploadDateStart}
                  onChange={(e) =>
                    handleFilterChange("uploadDateStart", e.target.value)
                  }
                />
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700"
                  value={filters.uploadDateEnd}
                  onChange={(e) =>
                    handleFilterChange("uploadDateEnd", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-md hover:from-purple-700 hover:to-purple-900 transition-colors duration-200"
            >
              Clear Filters
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                onApplyFilters();
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-md hover:from-purple-700 hover:to-purple-900 transition-colors duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

FilterBar.propTypes = {
  filters: PropTypes.shape({
    course: PropTypes.string,
    year: PropTypes.string,
    title: PropTypes.string,
    uploadDateStart: PropTypes.string,
    uploadDateEnd: PropTypes.string,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
};

export default FilterBar;

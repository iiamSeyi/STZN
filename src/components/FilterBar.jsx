// src/components/FilterBar.jsx
import React, { useState, useCallback } from "react";
import { FiFilter, FiCalendar, FiBook } from "react-icons/fi";

const FilterBar = ({ onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    course: "",
    year: "",
    title: "",
    uploadDateStart: "",
    uploadDateEnd: "",
  });

  // Generate years from 2000 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) =>
    (currentYear - i).toString()
  );

  // Debounced filter change handler
  const handleFilterChange = useCallback(
    (field, value) => {
      let newFilters = { ...filters };
      if (field === "course") {
        newFilters[field] = value?.trim() || "";
      } else {
        newFilters[field] = value;
      }

      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [filters, onFilterChange]
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
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg mb-6 transition-all duration-200">
      {/* Filter Header */}
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <FiFilter className="text-blue-600" />
          <h3 className="font-semibold text-gray-700">Filter Past Questions</h3>
          {/* Show active filters count */}
          {Object.values(filters).some((value) => value !== "") && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Active Filters
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
        <div className="p-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Course Filter */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FiBook className="mr-2 text-blue-500" />
                Course Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter course name"
                value={filters.course}
                onChange={(e) => handleFilterChange("course", e.target.value)}
              />
            </div>

            {/* Year Filter */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FiCalendar className="mr-2 text-blue-500" />
                Year
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FiCalendar className="mr-2 text-blue-500" />
                Upload Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={filters.uploadDateStart}
                  onChange={(e) =>
                    handleFilterChange("uploadDateStart", e.target.value)
                  }
                />
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={filters.uploadDateEnd}
                  onChange={(e) =>
                    handleFilterChange("uploadDateEnd", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;

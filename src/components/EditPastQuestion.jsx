// EditPastQuestion.jsx
import { useState } from "react";

const EditPastQuestion = ({ question, onUpdate, onCancel, isLoading }) => {
  const [editForm, setEditForm] = useState({
    title: question.title,
    course: question.course,
    year: question.year,
    file: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditForm((prev) => ({
      ...prev,
      file: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdate(editForm);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={editForm.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Course
          </label>
          <input
            type="text"
            name="course"
            value={editForm.course}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Year
          </label>
          <input
            type="text"
            name="year"
            value={editForm.year}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Update File (optional)
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-white
              ${isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}
              transition-colors`}
          >
            {isLoading ? "Updating..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPastQuestion;

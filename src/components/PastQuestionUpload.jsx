import { useState } from "react";
import PropTypes from "prop-types";
import { createDocument } from "../lib/firebase/db-operations";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, auth } from "../lib/firebase/config";

function PastQuestionUpload({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    year: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);

  // Generate years from 2000 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) =>
    (currentYear - i).toString()
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("You must be logged in to upload a past question.");
      return;
    }

    if (!formData.file || !formData.title || !formData.course || !formData.year) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const storageRef = ref(
        storage,
        `past-questions/${formData.file.name}-${Date.now()}`
      );
      await uploadBytes(storageRef, formData.file);
      const downloadURL = await getDownloadURL(storageRef);

      const pastQuestionData = {
        title: formData.title,
        course: formData.course,
        year: formData.year,
        imageUrl: downloadURL,
        uploadedAt: new Date().toISOString(),
        uploadedBy: auth.currentUser.uid,
      };

      await createDocument("pastQuestions", pastQuestionData);
      onSubmit();
      setFormData({ title: "", course: "", year: "", file: null });
    } catch (error) {
      console.error("Error uploading past question:", error);
      alert("Error uploading past question. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Title
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            placeholder="Enter title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Course Name
          </label>
          <input
            type="text"
            name="course"
            required
            value={formData.course}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            placeholder="Enter course name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Year
          </label>
          <select
            name="year"
            required
            value={formData.year}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-white dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            File
          </label>
          <input
            type="file"
            required
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 bg-white dark:bg-gray-700"
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-md hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
        >
          {loading ? "Uploading..." : "Upload Past Question"}
        </button>
      </form>
    </div>
  );
}

PastQuestionUpload.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default PastQuestionUpload;

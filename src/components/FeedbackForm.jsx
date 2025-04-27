import React, { useState } from "react";

// Mock function to simulate querying documents in a database
const queryDocuments = async (collection, query) => {
    // Simulate a delay for the database query
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Feedback saved successfully");
        }, 1000);
    });
};

const FeedbackForm = () => {
    const [feedback, setFeedback] = useState("");
    // Removed unused rating state
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Submitting feedback:", feedback);
            const response = await queryDocuments("feedback", [
                { field: "feedback", operator: "==", value: feedback },
            ]);
            console.log("Query response:", response);
            alert("Thank you for your feedback!");
            setFeedback(""); // Clear the input after successful submission
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Failed to submit feedback. Please try again later.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <textarea
            value={feedback}
            onChange={(e) => {
                console.log("Feedback input changed:", e.target.value);
                setFeedback(e.target.value);
            }}
            required
        ></textarea>
            <button type="submit">Submit</button>
        </form>
    );
};

export default FeedbackForm;
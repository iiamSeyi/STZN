import React from 'react';
import FeedbackForm from './FeedbackForm';
const Footer = () => {
  
    const [showFeedbackForm, setShowFeedbackForm] = React.useState(false);
    const handleFeedbackClick = () => {
        setShowFeedbackForm(!showFeedbackForm);
    };
    return (
        <footer className="bg-white text-black py-4">
            <div className="container mx-auto px-4 text-center">
                <p className="mb-2">We value your feedback! Let us know how we can improve.</p>
                <button
                    onClick={handleFeedbackClick}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded"
                >
                    Give Feedback
                </button>
            </div>
            {showFeedbackForm && (
                <div className="mt-4">
                    <FeedbackForm />
                </div>
            )}
        </footer>
    );
};

export default Footer;
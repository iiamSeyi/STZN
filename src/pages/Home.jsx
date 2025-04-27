import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase/config';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
} from 'firebase/auth';

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Home component mounted");
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user);
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  console.log("Rendering Home component");

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

return (
  <div
    className="text-center min-h-screen flex flex-col items-center justify-center text-white rounded-lg"
    style={{
      backgroundImage: "url('/media/istockphoto.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <h1 className="text-6xl font-bold mb-4">Welcome to PQ-ACE</h1>
    <p className="text-2xl mb-4">Where Past Questions Meet Future Success.</p>
    <p className="text-xl mb-8">
      A space where students can share resources to enhance their learning and prepare for exams, tests, and quizzes.
    </p>
    {!user && (
      <button
        onClick={loginWithGoogle}
        className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-3 rounded-lg text-lg hover:from-purple-700 hover:to-purple-900 transition-colors"
      >
        Get Started
      </button>
    )}
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
      <FeatureCard
        title="Share Resources"
        description="Upload and share past questions and study materials with your peers."
      />
      <FeatureCard
        title="Collaborate"
        description="Work together with fellow students to enhance your understanding."
      />
      <FeatureCard
        title="Prepare Effectively"
        description="Utilize shared resources to prepare for your upcoming exams and quizzes."
      />
    </div>
  </div>
);
}

function FeatureCard({ title, description }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
      <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white inline-block px-2 py-1 rounded">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}

export default Home;

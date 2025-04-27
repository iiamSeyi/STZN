import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PastQuestions from "./pages/PastQuestions";
import "./App.css";
import GeminiChatPage from "./pages/GeminiChatPage";
import SavedQuestionsPage from "./pages/SavedQuestionsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="past-questions" element={<PastQuestions />} />
            <Route path="gemini-chat" element={<GeminiChatPage />} />
            <Route path="/saved-questions" element={<SavedQuestionsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

// pages/GeminiChatPage.jsx
import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Link } from "react-router-dom";
import {
  FiUpload,
  FiSend,
  FiImage,
  FiMic,
  FiMicOff,
  FiVolume2,
  FiVolumeX,
  FiBookmark,
  FiX,
  FiSave,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}

// const QuestionCard = ({ question, index }) => {
//   const questionParts = question.question.split(":");
//   const questionContent =
//     questionParts.length > 1 ? questionParts[1].trim() : question.question;
//   return (
//     <div className="bg-white p-4 rounded-lg shadow mb-2 hover:shadow-md transition-shadow">
//       <div className="space-y-3">
//         <div className="flex items-start">
//           <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
//             {index + 1}
//           </span>
//           <p className="flex-1">{questionContent}</p>
//         </div>
//         {question.options && (
//           <div className="ml-8 space-y-2">
//             {question.options.map((option, optIndex) => (
//               <div
//                 key={optIndex}
//                 className={`p-2 rounded-lg ${
//                   question.correctAnswer === option[0]
//                     ? "bg-green-100 border border-green-200"
//                     : "bg-gray-50"
//                 }`}
//               >
//                 {option}
//               </div>
//             ))}
//           </div>
//         )}
//         {question.explanation && (
//           <div className="ml-8 mt-2">
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">Explanation:</span>{" "}
//               {question.explanation}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const QuestionCard = ({ question, index }) => {
//   // Parse the question text to separate question number from content
//   const questionParts = question.question.split(":");
//   const questionContent =
//     questionParts.length > 1 ? questionParts[1].trim() : question.question;

//   return (
//     <div className="bg-white p-4 rounded-lg shadow mb-2 hover:shadow-md transition-shadow">
//       <div className="space-y-3">
//         <div className="flex items-start">
//           <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
//             {index + 1}
//           </span>
//           <p className="flex-1">{questionContent}</p>
//         </div>

//         {question.options && question.options.length > 0 && (
//           <div className="ml-8 space-y-2">
//             {question.options.map((option, optIndex) => (
//               <div
//                 key={optIndex}
//                 className={`p-2 rounded-lg ${
//                   question.correctAnswer === option[0]
//                     ? "bg-green-100 border border-green-200"
//                     : "bg-gray-50"
//                 }`}
//               >
//                 {option}
//               </div>
//             ))}
//           </div>
//         )}

//         {question.correctAnswer && (
//           <div className="ml-8 mt-2">
//             <p className="text-sm text-green-600 font-medium">
//               Correct Answer: {question.correctAnswer}
//             </p>
//           </div>
//         )}

//         {question.explanation && (
//           <div className="ml-8 mt-2">
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">Explanation:</span>{" "}
//               {question.explanation}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

const QuestionCard = ({ question, index }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-2 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        {/* Question Header */}
        <div className="flex items-start">
          <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
            {index + 1}
          </span>
          <p className="flex-1">{question.question}</p>
        </div>

        {/* Options */}
        <div className="ml-8 space-y-2">
          {question.options.map((option, optIndex) => (
            <div
              key={optIndex}
              className={`p-2 rounded-lg transition-all duration-300 ${
                showAnswer && question.correctAnswer === option[0]
                  ? "bg-green-100 border border-green-200 transform scale-102"
                  : "bg-gray-50"
              }`}
            >
              {option}
            </div>
          ))}
        </div>

        {/* Show/Hide Answer Button */}
        <div className="ml-8 mt-4">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              showAnswer
                ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </button>
        </div>

        {/* Answer and Explanation with Animation */}
        <div
          className={`ml-8 mt-2 space-y-2 transition-all duration-300 overflow-hidden ${
            showAnswer ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="transform transition-all duration-300 translate-y-0">
            <p className="text-sm text-green-600 font-medium">
              Correct Answer: {question.correctAnswer}
            </p>
            {question.explanation && (
              <div className="bg-gray-50 p-3 rounded-lg mt-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Explanation:</span>{" "}
                  {question.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SavedQuestionsViewer = ({ savedQuestions, onDelete }) => {
  if (!savedQuestions.length) return null;

  return (
    <div className="border-t border-gray-200 mt-4">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Saved Questions</h3>
        <div className="space-y-4">
          {savedQuestions.map((savedSet) => (
            <div key={savedSet.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="font-medium">{savedSet.document}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(savedSet.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(savedSet.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiX />
                </button>
              </div>
              <div className="space-y-2">
                {savedSet.questions.map((question, index) => (
                  <QuestionCard key={index} question={question} index={index} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const GeminiChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [questionType, setQuestionType] = useState("both");

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  // Initialize Gemini
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const textModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  // Load saved questions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedQuestions");
    if (saved) {
      setSavedQuestions(JSON.parse(saved));
    }
  }, []);
  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
        setInput("");
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setSpeechError(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");

        setInput(transcript);

        if (event.results[0].isFinal) {
          recognition.stop();
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateQuestions = async () => {
    if (!selectedFile) {
      alert("Please upload a document first");
      return;
    }

    setIsGeneratingQuestions(true);
    try {
      const imagePart = await fileToGenerativePart(selectedFile);
      const prompt = `Based on this document, generate 5 ${
        questionType === "both"
          ? "questions mixing multiple choice and open-ended formats"
          : questionType === "multiple"
          ? "multiple choice questions"
          : "open-ended questions"
      }.

      ${
        questionType === "multiple" || questionType === "both"
          ? `For multiple choice questions, use this format:
            Question X:
            [Question text]
            A) [Option A]
            B) [Option B]
            C) [Option C]
            D) [Option D]
            Correct Answer: [Letter]
            Explanation: [Brief explanation]`
          : ""
      }

      ${
        questionType === "open" || questionType === "both"
          ? `For open-ended questions, use this format:
            Question X:
            [Question text]
            Suggested Answer: [Brief answer]
            Explanation: [Detailed explanation]`
          : ""
      }

      Please generate thoughtful questions that test understanding of the key concepts.`;

      const result = await visionModel.generateContent([prompt, imagePart]);
      const response = await result.response;

      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "Generating practice questions...",
          type: "notification",
        },
        {
          role: "assistant",
          content: response.text(),
          type: "questions",
        },
      ]);

      // Parse questions from response
      const questions = parseQuestionsFromResponse(response.text());
      setGeneratedQuestions(questions);
    } catch (error) {
      console.error("Error generating questions:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error generating questions. Please try again.",
          error: true,
        },
      ]);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  //   const parseQuestionsFromResponse = (text) => {
  //     const questions = [];
  //     const questionBlocks = text.split(/Question \d+:/g).filter(Boolean);

  //     questionBlocks.forEach((block) => {
  //       const lines = block.trim().split("\n");
  //       const question = {
  //         question: lines[0].trim(),
  //         options: [],
  //         correctAnswer: "",
  //         explanation: "",
  //       };

  //       lines.forEach((line) => {
  //         const trimmedLine = line.trim();
  //         if (trimmedLine.match(/^[A-D]\)/)) {
  //           question.options.push(trimmedLine);
  //         } else if (trimmedLine.startsWith("Correct Answer:")) {
  //           question.correctAnswer = trimmedLine
  //             .replace("Correct Answer:", "")
  //             .trim();
  //         } else if (trimmedLine.startsWith("Explanation:")) {
  //           question.explanation = trimmedLine.replace("Explanation:", "").trim();
  //         }
  //       });

  //       if (question.question) {
  //         questions.push(question);
  //       }
  //     });

  //     return questions;
  //   };

  const parseQuestionsFromResponse = (text) => {
    const questions = [];

    // Properly split at '**Question 1:**', '**Question 2:**', etc
    const questionBlocks = text
      .split(/\*\*Question \d+:\*\*/g)
      .filter((block) => block.trim());

    questionBlocks.forEach((block) => {
      const cleanBlock = block.replace(/\*\*/g, "").trim(); // remove any stray **
      const lines = cleanBlock
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length === 0) return;

      const questionText = lines[0]; // First line is the question text

      const question = {
        question: questionText,
        options: [],
        correctAnswer: "",
        explanation: "",
      };

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];

        if (/^[A-D]\)/.test(line)) {
          question.options.push(line);
        } else if (line.startsWith("Correct Answer:")) {
          question.correctAnswer = line.replace("Correct Answer:", "").trim();
        } else if (line.startsWith("Explanation:")) {
          question.explanation = line.replace("Explanation:", "").trim();
        }
      }

      // Only add valid question
      if (question.options.length > 0 && question.correctAnswer) {
        questions.push(question);
      }
    });

    return questions;
  };

  const saveQuestions = () => {
    if (!generatedQuestions.length) return;

    const questionsToSave = {
      id: Date.now(),
      document: selectedFile?.name || "Untitled Document",
      questions: generatedQuestions,
      timestamp: new Date().toISOString(),
    };

    const updatedSavedQuestions = [...savedQuestions, questionsToSave];
    setSavedQuestions(updatedSavedQuestions);

    try {
      localStorage.setItem(
        "savedQuestions",
        JSON.stringify(updatedSavedQuestions)
      );
      alert("Questions saved successfully!");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      alert("Failed to save questions. Local storage might be full.");
    }
  };

  const deleteSavedQuestions = (id) => {
    if (window.confirm("Are you sure you want to delete these questions?")) {
      const updatedSavedQuestions = savedQuestions.filter(
        (set) => set.id !== id
      );
      setSavedQuestions(updatedSavedQuestions);
      localStorage.setItem(
        "savedQuestions",
        JSON.stringify(updatedSavedQuestions)
      );
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      setSpeechError("Speech recognition is not supported in your browser");
      return;
    }

    const timeout = setTimeout(() => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    }, 10000);

    try {
      setInput("");
      setSpeechError(null);

      recognitionRef.current.onend = () => {
        clearTimeout(timeout);
        setIsListening(false);
      };

      recognitionRef.current.start();
    } catch (error) {
      console.error("Speech recognition error:", error);
      setSpeechError("Failed to start speech recognition");
      clearTimeout(timeout);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsSpeaking(false);
      };

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (voice) => voice.lang === selectedLanguage
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
      speechSynthesisRef.current = utterance;
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        setSelectedFile(file);
        setGeneratedQuestions([]); // Clear previous questions

        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFilePreview(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
          setFilePreview("PDF Document");
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            content: `File uploaded: ${file.name}`,
            type: "notification",
          },
        ]);
      } else {
        alert("Please upload an image or PDF file");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        hasFile: !!selectedFile,
      },
    ]);

    try {
      let response;

      if (selectedFile) {
        try {
          const imagePart = await fileToGenerativePart(selectedFile);
          const result = await visionModel.generateContent([
            userMessage || "Analyze this document and provide key insights",
            imagePart,
          ]);
          response = await result.response;
        } catch (fileError) {
          console.error("Error processing file:", fileError);
          throw new Error("Failed to process the uploaded file");
        }
      } else {
        const result = await textModel.generateContent(userMessage);
        response = await result.response;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.text(),
        },
      ]);

      setSelectedFile(null);
      setFilePreview(null);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${
            error.message || "Something went wrong. Please try again."
          }`,
          error: true,
        },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors">
          {/* Chat Header */}
          <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 text-white">
            <div className="flex flex-col gap-2">
              {/* Title and Description */}
              <div>
                <h1 className="text-xl font-semibold">Chat with Gemini AI</h1>
                <p className="text-sm opacity-90">
                  Upload documents to generate questions or ask anything
                </p>
              </div>
              <div className="flex justify-between items-center mt-2">
                {/* Language Selector */}
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="mt-2 w-fit text-sm border rounded-lg p-1 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                  <option value="de-DE">German</option>
                  <option value="it-IT">Italian</option>
                  <option value="pt-BR">Portuguese (Brazil)</option>
                  <option value="ru-RU">Russian</option>
                  <option value="ja-JP">Japanese</option>
                  <option value="ko-KR">Korean</option>
                  <option value="zh-CN">Chinese (Simplified)</option>
                  <option value="ar-SA">Arabic</option>
                  {/* Add more language options as needed */}
                </select>

                {/* Saved Questions Link */}
                <Link
                  to="/saved-questions"
                  className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
                >
                  <FiBookmark />
                  <span>Saved Questions</span>
                </Link>
              </div>

              <div className="mt-2">
                <label className="text-sm font-medium text-white">
                  Question Type:
                </label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="ml-2 text-sm border rounded-lg p-1 text-gray-800"
                >
                  <option value="multiple">Both Types</option>
                  <option value="open">Multiple Choice Only</option>
                  <option value="both">Open-Ended Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-[600px] overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.type === "notification" ? (
                  <div className="bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm">
                    {message.content}
                  </div>
                ) : (
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 text-white"
                        : message.error
                        ? "bg-red-100 dark:bg-red-800 dark:text-red-200"
                        : "bg-gray-100 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {message.hasFile && (
                      <div className="mb-2">
                        <FiImage className="inline mr-2" />
                        <span className="text-sm opacity-75">
                          File attached
                        </span>
                      </div>
                    )}
                    <div className="prose prose-sm">
                      <div className="w-full text-left">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code: ({ node, inline, children, ...props }) => {
                              const codeText = String(children).trim();
                              if (!inline) {
                                return (
                                  <div className="relative">
                                    <pre className="p-4 bg-gray-900 text-white rounded overflow-auto">
                                      <code {...props}>{children}</code>
                                    </pre>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(codeText);
                                        alert("Code copied to clipboard!");
                                      }}
                                      className="absolute top-2 right-2 opacity-60 hover:opacity-100 bg-gray-700 text-sm text-white px-2 py-1 rounded z-10 transition-opacity"
                                    >
                                      Copy
                                    </button>
                                  </div>
                                );
                              }
                              return (
                                <code
                                  className="bg-gray-200 dark:bg-gray-700 px-1 rounded"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      {message.role === "assistant" && !message.error && (
                        <button
                          onClick={() => speakText(message.content)}
                          className="ml-2 text-sm text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          {isSpeaking ? <FiVolumeX /> : <FiVolume2 />}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* File Preview and Question Generation */}
          {filePreview && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex-shrink-0">
                    {typeof filePreview === "string" &&
                    filePreview === "PDF Document" ? (
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-800 rounded flex items-center justify-center">
                        PDF
                      </div>
                    ) : (
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium dark:text-gray-200">
                      {selectedFile?.name}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreview(null);
                        setGeneratedQuestions([]);
                      }}
                      className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <button
                  onClick={generateQuestions}
                  disabled={isGeneratingQuestions}
                  className={`px-4 py-2 rounded-lg text-white ${
                    isGeneratingQuestions
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isGeneratingQuestions ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    "Generate Questions"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Generated Questions Section */}
          {generatedQuestions.length > 0 && (
            <div className="border-t border-gray-200">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Generated Practice Questions
                  </h3>
                  <button
                    onClick={saveQuestions}
                    className="flex items-center space-x-2 px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <FiSave />
                    <span>Save Questions</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {generatedQuestions.map((question, index) => (
                    <QuestionCard
                      key={index}
                      question={question}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 p-2 text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 rounded-lg hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-700 dark:hover:from-purple-600 dark:hover:to-purple-800"
              >
                <FiUpload size={20} />
              </button>

              <button
                type="button"
                onClick={toggleListening}
                className={`flex-shrink-0 p-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-700 dark:hover:from-purple-600 dark:hover:to-purple-800 ${
                  isListening
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400"
                }`}
                title={
                  speechError ||
                  (isListening ? "Stop listening" : "Start voice input")
                }
              >
                {isListening ? <FiMicOff size={20} /> : <FiMic size={20} />}
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,application/pdf"
                className="hidden"
              />

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isListening
                      ? "Listening..."
                      : selectedFile
                      ? "Ask about the uploaded file or press Enter to analyze"
                      : "Type your message..."
                  }
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isListening ? "bg-red-50" : ""
                  }`}
                  disabled={isLoading}
                />
                {isListening && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-75" />
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-150" />
                    </div>
                    <button
                      type="button"
                      onClick={stopListening}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                )}
                {input && !isListening && (
                  <button
                    type="button"
                    onClick={() => setInput("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 hover:text-gray-600"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || (!input.trim() && !selectedFile)}
                className="flex-shrink-0 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FiSend size={20} />
              </button>
            </form>

            {speechError && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                Error: {speechError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiChatPage;

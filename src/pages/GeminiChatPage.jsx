// // pages/GeminiChatPage.jsx
// import { useState, useRef, useEffect } from "react";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { FiUpload, FiSend, FiImage } from "react-icons/fi";

// async function fileToGenerativePart(file) {
//   const base64EncodedDataPromise = new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve(reader.result.split(",")[1]);
//     reader.readAsDataURL(file);
//   });

//   return {
//     inlineData: {
//       data: await base64EncodedDataPromise,
//       mimeType: file.type,
//     },
//   };
// }

// const GeminiChatPage = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);
//   const chatEndRef = useRef(null);
//   const fileInputRef = useRef(null);

//   // Initialize Gemini
//   const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
//   const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleFileSelect = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.type.startsWith("image/") || file.type === "application/pdf") {
//         setSelectedFile(file);

//         // Create preview for images
//         if (file.type.startsWith("image/")) {
//           const reader = new FileReader();
//           reader.onloadend = () => {
//             setFilePreview(reader.result);
//           };
//           reader.readAsDataURL(file);
//         } else {
//           setFilePreview("PDF Document");
//         }

//         // Add system message about the uploaded file
//         setMessages((prev) => [
//           ...prev,
//           {
//             role: "system",
//             content: `File uploaded: ${file.name}`,
//             type: "notification",
//           },
//         ]);
//       } else {
//         alert("Please upload an image or PDF file");
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!input.trim() && !selectedFile) return;

//     const userMessage = input.trim();
//     setInput("");
//     setIsLoading(true);

//     // Add user message to chat
//     setMessages((prev) => [
//       ...prev,
//       {
//         role: "user",
//         content: userMessage,
//         hasFile: !!selectedFile,
//       },
//     ]);

//     try {
//       let response;

//       if (selectedFile) {
//         // Handle file-based query
//         const imagePart = await fileToGenerativePart(selectedFile);
//         const result = await model.generateContent([
//           userMessage || "Analyze this document and provide key insights",
//           imagePart,
//         ]);
//         response = await result.response;
//       } else {
//         // Handle text-only query
//         const textModel = genAI.getGenerativeModel({ model: "gemini-pro" });
//         const result = await textModel.generateContent(userMessage);
//         response = await result.response;
//       }

//       // Add AI response to chat
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: response.text(),
//         },
//       ]);

//       // Clear file after processing
//       setSelectedFile(null);
//       setFilePreview(null);
//     } catch (error) {
//       console.error("Error generating response:", error);
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: "Sorry, I encountered an error. Please try again.",
//           error: true,
//         },
//       ]);
//     }

//     setIsLoading(false);
//   };

// pages/GeminiChatPage.jsx
import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FiUpload, FiSend, FiImage } from "react-icons/fi";

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

const GeminiChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const textModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

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
        setInput(""); // Clear input when starting new recording
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setSpeechError(event.error);
        setIsListening(false);

        // Attempt to restart on certain errors
        if (event.error === "network") {
          setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.start();
            }
          }, 1000);
        }
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

        // If this is a final result, stop listening
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && (file.type.startsWith("image/") || file.type === "application/pdf")) {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setFilePreview("PDF Document");
      }
      setMessages((prev) => [
        ...prev,
        { role: "system", content: `File uploaded: ${file.name}`, type: "notification" },
      ]);
    } else {
      alert("Please upload an image or PDF file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: input.trim(), hasFile: !!selectedFile },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      let response;
      if (selectedFile) {
        const imagePart = await fileToGenerativePart(selectedFile);
        const result = await visionModel.generateContent([
          input.trim() || "Analyze this document and provide key insights",
          imagePart,
        ]);
        response = await result.response;
      } else {
        const result = await textModel.generateContent(input.trim());
        response = await result.response;
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.text() },
      ]);
      setSelectedFile(null);
      setFilePreview(null);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${error.message || "Something went wrong."}`,
          error: true,
        },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">

          {/* Header */}
          <div className="p-4 bg-blue-500 text-white">
            <h1 className="text-xl font-semibold">Chat with Gemini AI</h1>
            <p className="text-sm opacity-90">
              Upload past questions or ask anything about your studies
            </p>
            {/* Language Selection */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="mt-2 text-sm border rounded-lg p-1 text-gray-800"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
              <option value="it-IT">Italian</option>
              <option value="pt-BR">Portuguese</option>
              <option value="hi-IN">Hindi</option>
              <option value="ja-JP">Japanese</option>
              <option value="ko-KR">Korean</option>
              <option value="zh-CN">Chinese (Simplified)</option>
            </select>
          </div>

          {/* Chat Messages */}
          <div className="h-[600px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start items-start"
                }`}
              >
                {message.type === "notification" ? (
                  <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm">
                    {message.content}
                  </div>
                ) : (
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : message.error
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-800"
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
                    <div className="prose prose-sm">{message.content}</div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-lg animate-pulse space-x-1 flex">
                  <span className="h-2 w-2 bg-gray-400 rounded-full" />
                  <span className="h-2 w-2 bg-gray-400 rounded-full" />
                  <span className="h-2 w-2 bg-gray-400 rounded-full" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* File Preview */}
          {filePreview && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                  {filePreview === "PDF Document" ? (
                    <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
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
                  <p className="text-sm font-medium">{selectedFile?.name}</p>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setFilePreview(null);
                    }}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 p-2 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-gray-100"
              >
                <FiUpload size={20} />
              </button>

              {/* Voice Input Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 ${
                  isListening
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-500 hover:text-blue-500"
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
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
              <p className="text-red-500 text-sm mt-2">Error: {speechError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiChatPage;
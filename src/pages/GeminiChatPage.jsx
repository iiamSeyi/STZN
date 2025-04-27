// pages/GeminiChatPage.jsx
import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  FiUpload,
  FiSend,
  FiImage,
  FiMic,
  FiMicOff,
  FiVolume2,
  FiVolumeX,
  FiX,
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
  const [copied, setCopied] = useState(false);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  // Initialize Gemini
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const textModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  // Speech recognition setup...
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const Recognition = window.webkitSpeechRecognition;
      const recog = new Recognition();
      recog.continuous = false;
      recog.interimResults = true;
      recog.lang = selectedLanguage;
      recog.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
        setInput("");
      };
      recog.onerror = (e) => {
        setSpeechError(e.error);
        setIsListening(false);
      };
      recog.onend = () => setIsListening(false);
      recog.onresult = (e) => {
        const transcript = Array.from(e.results)
          .map((r) => r[0].transcript)
          .join("");
        setInput(transcript);
        if (e.results[0].isFinal) recog.stop();
      };
      recognitionRef.current = recog;
    }
    return () => {
      recognitionRef.current?.stop();
      speechSynthesisRef.current && window.speechSynthesis.cancel();
    };
  }, [selectedLanguage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startListening = () => {
    if (!recognitionRef.current) {
      setSpeechError("Speech recognition not supported");
      return;
    }
    setInput("");
    setSpeechError(null);
    try {
      recognitionRef.current.start();
    } catch {
      setSpeechError("Failed to start recognition");
    }
  };
  const stopListening = () => recognitionRef.current?.stop();
  const toggleListening = () =>
    isListening ? stopListening() : startListening();

  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) return setIsSpeaking(false);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = selectedLanguage;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    speechSynthesisRef.current = u;
    window.speechSynthesis.speak(u);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type.startsWith("image/") || file.type === "application/pdf")) {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        const r = new FileReader();
        r.onloadend = () => setFilePreview(r.result);
        r.readAsDataURL(file);
      } else {
        setFilePreview("PDF Document");
      }
      setMessages((m) => [...m, { role: "system", content: `File uploaded: ${file.name}`, type: "notification" }]);
    } else {
      alert("Please upload an image or PDF");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;
    const userMsg = input.trim();
    setInput("");
    setIsLoading(true);
    setMessages((m) => [...m, { role: "user", content: userMsg, hasFile: !!selectedFile }]);
    try {
      let response;
      if (selectedFile) {
        const imagePart = await fileToGenerativePart(selectedFile);
        const res = await visionModel.generateContent([userMsg || "Analyze document", imagePart]);
        response = await res.response;
      } else {
        const res = await textModel.generateContent(userMsg);
        response = await res.response;
      }
      setMessages((m) => [...m, { role: "assistant", content: response.text() }]);
      setSelectedFile(null);
      setFilePreview(null);
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", content: `Error: ${err.message}`, error: true }]);
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
            <p className="text-sm opacity-90">Upload past questions or ask anything</p>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="mt-2 p-1 text-sm border rounded-lg text-gray-800"
            >
              <option value="en-US">English (US)</option>
              <option value="es-ES">Spanish</option>
              {/* …other langs */}
            </select>
          </div>

          {/* Messages */}
          <div className="h-[600px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start items-start"
                }`}
              >
                {msg.type === "notification" ? (
                  <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm">
                    {msg.content}
                  </div>
                ) : (
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white text-right"
                        : msg.error
                        ? "bg-red-100 text-red-700 text-left"
                        : "bg-gray-100 text-gray-800 text-left"
                    }`}
                  >
                    {msg.hasFile && (
                      <div className="mb-2 flex items-center text-sm opacity-75">
                        <FiImage className="inline mr-2" /> File attached
                      </div>
                    )}

                    {/* Markdown wrapper with Tailwind typography */}
                    <div className="prose prose-sm space-y-4">
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
                                      setCopied(true);
                                      setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="absolute top-2 right-2 opacity-60 hover:opacity-100 bg-gray-700 text-sm text-white px-2 py-1 rounded z-10 transition-opacity"
                                  >
                                    {copied ? "Copied!" : "Copy"}
                                  </button>
                                </div>
                              );
                            }
                            return <code className="bg-gray-200 px-1 rounded" {...props}>{children}</code>;
                          },
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>

                      {/* Speak button for assistant */}
                      {msg.role === "assistant" && !msg.error && (
                        <button
                          onClick={() => speakText(msg.content)}
                          className="mt-2 text-sm text-blue-500 hover:text-blue-700"
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
                <div className="bg-gray-100 p-4 rounded-lg animate-pulse space-x-2 flex">
                  <div className="h-2 w-2 bg-gray-400 rounded-full" />
                  <div className="h-2 w-2 bg-gray-400 rounded-full" />
                  <div className="h-2 w-2 bg-gray-400 rounded-full" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* File preview */}
          {filePreview && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                  {filePreview === "PDF Document" ? (
                    <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                      PDF
                    </div>
                  ) : (
                    <img src={filePreview} alt="Preview" className="w-10 h-10 rounded" />
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

          {/* Input area */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-gray-100"
              >
                <FiUpload size={20} />
              </button>
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-lg hover:bg-gray-100 ${
                  isListening ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-blue-500"
                }`}
                title={speechError || (isListening ? "Stop listening" : "Start voice input")}
              >
                {isListening ? <FiMicOff size={20} /> : <FiMic size={20} />}
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,application/pdf" className="hidden" />
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Listening..." : selectedFile ? "Ask about file or press Enter" : "Type your message..."}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isListening ? "bg-red-50" : ""}`}
                  disabled={isLoading}
                />
                {isListening && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-75" />
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-150" />
                    </div>
                    <button type="button" onClick={stopListening} className="text-red-500 hover:text-red-700 p-1">
                      <FiX size={16} />
                    </button>
                  </div>
                )}
                {input && !isListening && (
                  <button type="button" onClick={() => setInput("")} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <FiX size={16} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading || (!input.trim() && !selectedFile)}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FiSend size={20} />
              </button>
            </form>
            {speechError && <p className="mt-2 text-red-500 text-sm">Error: {speechError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiChatPage;
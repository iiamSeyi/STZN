import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FiUpload, FiSend, FiImage } from "react-icons/fi";
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
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const textModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white text-right"
                      : "bg-gray-100 text-gray-800 text-left"
                  }`}
                >
                  {msg.hasFile && (
                    <div className="mb-2 flex items-center text-sm opacity-75">
                      <FiImage className="inline mr-2" /> File attached
                    </div>
                  )}

                  {/* Markdown with copy-to-clipboard for code blocks */}
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
                          return (
                            <code className="bg-gray-200 px-1 rounded" {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
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
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,application/pdf"
                className="hidden"
              />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  selectedFile
                    ? "Ask about the uploaded file or press Enter to analyze"
                    : "Type your message..."
                }
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || (!input.trim() && !selectedFile)}
                className="flex-shrink-0 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FiSend size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiChatPage;
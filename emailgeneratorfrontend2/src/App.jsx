import { useState } from "react";
import { Send, Copy, Mail, Settings, Check, RotateCcw, Zap } from "lucide-react";

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      // Note: Using fetch instead of axios since axios is not available
      const response = await fetch("http://localhost:8080/api/email/generate", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailContent,
          tone
        })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.text();
      setGeneratedReply(data);
    } catch (error) {
      setError('Failed to generate Email reply. Please try again');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedReply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text');
    }
  };

  const handleReset = () => {
    setEmailContent('');
    setTone('');
    setGeneratedReply('');
    setError('');
  };

  const toneOptions = [
    { value: '', label: 'No specific tone', color: 'bg-gray-100 text-gray-800' },
    { value: 'professional', label: 'Professional', color: 'bg-blue-100 text-blue-800' },
    { value: 'casual', label: 'Casual', color: 'bg-green-100 text-green-800' },
    { value: 'friendly', label: 'Friendly', color: 'bg-purple-100 text-purple-800' }
  ];

  const selectedToneOption = toneOptions.find(option => option.value === tone);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 text-white rounded-3xl p-8 mb-8 text-center shadow-2xl">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-full mr-4">
              <Mail className="w-10 h-10" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold">
              AI Email Reply Generator
            </h1>
          </div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Transform any email into a professional, well-crafted response using the power of AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-gray-100">
              <div className="flex items-center">
                <Settings className="w-6 h-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Compose Your Reply</h2>
              </div>
            </div>
            
            <div className="p-8">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Original Email Content
                </label>
                <textarea
                  rows={10}
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Paste the original email content here...&#10;&#10;Dear John,&#10;&#10;I hope this email finds you well...&#10;&#10;Best regards,&#10;Sarah"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200 bg-gray-50/50"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Response Tone (Optional)
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50/50"
                >
                  {toneOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {selectedToneOption && selectedToneOption.value && (
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedToneOption.color}`}>
                      {selectedToneOption.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={!emailContent || loading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Generate Reply
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleReset}
                  className="bg-gray-100 text-gray-700 p-3 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                  title="Clear all fields"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-semibold text-gray-800">Generated Reply</h2>
                </div>
                {selectedToneOption && selectedToneOption.value && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedToneOption.color}`}>
                    <Zap className="w-4 h-4 mr-1" />
                    {selectedToneOption.label}
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-8 h-full">
              {!generatedReply && !loading && (
                <div className="h-80 flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <div className="bg-gray-200 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                      <Mail className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-lg font-medium mb-2">
                      Your AI-generated email reply will appear here
                    </p>
                    <p className="text-gray-400 text-sm">
                      Fill in the email content and click generate
                    </p>
                  </div>
                </div>
              )}

              {generatedReply && (
                <div className="space-y-4">
                  <textarea
                    rows={16}
                    value={generatedReply}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 resize-none focus:outline-none"
                  />
                  
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">{generatedReply.length}</span> characters • Generated with AI
                      </div>
                      
                      <button
                        onClick={handleCopy}
                        className={`flex items-center px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                          copied 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200'
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Reply
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 opacity-70">
          <p className="text-gray-600 text-sm">
            Powered by AI • Generate professional email replies in seconds
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
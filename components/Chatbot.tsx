// src/components/Chatbot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, X, Loader, Bot } from 'lucide-react';
import { sendChatMessage } from '../services/api';
import { useLocation } from 'react-router-dom';

interface ChatMessage {
    sender: 'user' | 'model';
    text: string;
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'model', text: 'Assalam-o-Alaikum! YourStoreName mein khushamdeed. Main aapki kya madad kar sakta hoon? ⌚' }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatBoxRef = useRef<HTMLDivElement>(null);

    // FIX: Auto-close on page change
    const location = useLocation();
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const userMessage = userInput.trim();
        const newHistory = [...messages, { text: userMessage, sender: 'user' } as ChatMessage];

        setMessages(newHistory);
        setUserInput('');
        setIsLoading(true);

        try {
            // Use the secure backend function
            const botReply = await sendChatMessage(userMessage);
            setMessages(prev => [...prev, { sender: 'model', text: botReply }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'model', text: 'Connection error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-20 md:bottom-6 right-6 z-[60] bg-yellow-500 text-gray-900 p-4 rounded-full shadow-2xl hover:bg-yellow-400 transition-transform transform hover:scale-110 border-2 border-gray-900"
                aria-label="Toggle Chat"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-36 md:bottom-24 right-6 z-[60] w-80 sm:w-96 h-[500px] max-h-[60vh] bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">

                    {/* Header */}
                    <div className="bg-gray-900 p-4 border-b border-gray-700 flex items-center space-x-3">
                        <div className="bg-yellow-500 p-2 rounded-full">
                            <Bot size={20} className="text-black" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">ChronoBot AI</h3>
                            <p className="text-xs text-green-400 flex items-center">● Online</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div ref={chatBoxRef} className="flex-grow p-4 overflow-y-auto space-y-3 bg-gray-800/95 scrollbar-thin scrollbar-thumb-gray-600">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-md ${msg.sender === 'user'
                                    ? 'bg-yellow-500 text-gray-900 rounded-tr-none font-medium'
                                    : 'bg-gray-700 text-white rounded-tl-none border border-gray-600'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-700 px-4 py-2 rounded-2xl rounded-tl-none border border-gray-600 flex items-center space-x-2">
                                    <Loader className="animate-spin text-yellow-500" size={16} />
                                    <span className="text-xs text-gray-400">Thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-3 bg-gray-900 border-t border-gray-700">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Ask about watches..."
                                className="flex-grow bg-gray-800 text-white text-sm border border-gray-600 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !userInput.trim()}
                                className="bg-yellow-500 text-gray-900 p-3 rounded-full hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;
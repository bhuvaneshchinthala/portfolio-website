import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ChatBot() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide the floating button on the chat page itself
  if (location.pathname === '/chat') return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <motion.button
        onClick={() => navigate('/chat')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-16 h-16 rounded-full bg-black border border-red-500/30 flex items-center justify-center cursor-pointer shadow-[0_0_25px_rgba(255,40,0,0.15)] hover:shadow-[0_0_35px_rgba(255,40,0,0.4)] transition-all duration-300"
      >
        {/* Inner breathing glow */}
        <div className="absolute inset-0 rounded-full bg-red-500/5 animate-pulse pointer-events-none" />
        <MessageSquare className="text-red-500 w-5 h-5" />
      </motion.button>
    </div>
  );
}

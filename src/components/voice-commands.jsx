import React, { useEffect, useState, useRef } from 'react';
import { Icon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';

export function VoiceCommands() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [message, setMessage] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    try {
      // Check if browser supports speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error('Speech recognition not supported');
        setMessage("Browser doesn't support speech recognition.");
        return;
      }

      // Initialize speech recognition
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      // Set up event handlers
      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        console.log('Transcript:', transcriptText);
        setTranscript(transcriptText);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setMessage(`Error: ${event.error}`);
        setIsListening(false);
      };

    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      setMessage('Error initializing speech recognition');
    }

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = async () => {
    try {
      if (!recognitionRef.current) {
        console.error('Speech recognition not initialized');
        return;
      }

      if (isListening) {
        recognitionRef.current.stop();
      } else {
        // Request microphone permission first
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the stream after permission
        
        recognitionRef.current.start();
        setTranscript('');
      }
    } catch (error) {
      console.error('Error toggling speech recognition:', error);
      setMessage('Error accessing microphone. Please check your permissions.');
    }
  };

  return (
    <div className="relative w-full">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleListening}
        className={`
          relative w-16 h-16 rounded-full shadow-lg flex items-center justify-center
          ${isListening ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'}
          transition-colors duration-200
        `}
      >
        <Icon
          name={isListening ? 'microphoneOff' : 'microphone'}
          className="w-8 h-8"
        />
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-destructive"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.button>

      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 p-4 rounded-lg bg-card border shadow-sm"
          >
            <div className="flex items-start space-x-2">
              <Icon name="messageSquare" className="w-4 h-4 text-primary mt-1" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Transcript</p>
                <p className="text-sm text-muted-foreground">{transcript}</p>
              </div>
              <button
                onClick={() => setTranscript('')}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {message && (
        <div className="mt-4 p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-4 text-xs text-muted-foreground">
        <p>Recognition Available: {!!window.SpeechRecognition || !!window.webkitSpeechRecognition ? 'Yes' : 'No'}</p>
        <p>Recognition Initialized: {!!recognitionRef.current ? 'Yes' : 'No'}</p>
        <p>Listening: {isListening ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}

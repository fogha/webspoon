import React, { useState, useEffect } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { commands } from './config/commands'
import { Button } from './components/ui/button'
import { Icon } from './components/icons'
import { Nav } from './components/nav'
import { Home } from './components/home'
import { Settings } from './components/settings'
import { Docs } from './components/docs'
import { Folders } from './components/folders'
import { cn } from './utils/tailwind'

// Check if we're in a Chrome extension environment
const isExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;

function App() {
  const [message, setMessage] = useState('Initializing...')
  const [suggestions, setSuggestions] = useState([])
  const [pendingAction, setPendingAction] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({
    commands: commands.map(cmd => ({
      command: cmd.trigger,
      callback: () => handleCommand(cmd.trigger),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.8
    }))
  });

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setMessage('Browser does not support speech recognition.');
      return;
    }

    setMessage(listening ? 'Listening...' : 'Click Start to begin listening');
  }, [listening, browserSupportsSpeechRecognition]);

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleCommand = async (command) => {
    try {
      const matchedCommand = commands.find(cmd => 
        cmd.trigger.toLowerCase() === command.toLowerCase() ||
        cmd.aliases?.some(alias => alias.toLowerCase() === command.toLowerCase())
      );

      if (matchedCommand) {
        if (matchedCommand.requiresConfirmation) {
          setPendingAction(() => () => executeCommand(matchedCommand));
          setSuggestions([]);
        } else {
          await executeCommand(matchedCommand);
        }
      } else {
        setMessage('Command not recognized');
        setSuggestions(findSimilarCommands(command));
      }
    } catch (error) {
      setMessage(`Error executing command: ${error.message}`);
    }
  };

  const executeCommand = async (command) => {
    try {
      await command.action();
      setMessage(`Executed: ${command.description}`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setPendingAction(null);
    }
  };

  const confirmAction = () => {
    if (pendingAction) {
      pendingAction();
    }
  };

  const cancelAction = () => {
    setPendingAction(null);
    setMessage('Action cancelled');
  };

  const findSimilarCommands = (input) => {
    const inputLower = input.toLowerCase();
    return commands
      .filter(cmd => {
        const similarity = calculateSimilarity(inputLower, cmd.trigger.toLowerCase());
        return similarity > 0.3;
      })
      .map(cmd => ({
        trigger: cmd.trigger,
        description: cmd.description
      }))
      .slice(0, 3);
  };

  const calculateSimilarity = (str1, str2) => {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const maxLen = Math.max(len1, len2);
    return (maxLen - matrix[len1][len2]) / maxLen;
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'docs':
        return <Docs />;
      case 'folders':
        return <Folders />;
      case 'settings':
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex flex-col min-h-[600px] w-full max-w-[800px] bg-background rounded-xl shadow-lg overflow-hidden">
      <Nav onNavigate={setCurrentPage} currentPage={currentPage} />
      <div className="flex-1 overflow-auto w-full">
        <div className="w-full h-full">
          {renderContent()}
          
          {transcript && (
            <div className="w-full max-w-md mx-auto mt-4 p-4 bg-muted rounded-lg">
              <h2 className="font-semibold mb-2">Transcript:</h2>
              <p className="text-sm text-muted-foreground">{transcript}</p>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="w-full max-w-md mx-auto mt-4">
              <h2 className="font-semibold mb-2">Did you mean:</h2>
              <ul className="space-y-2">
                {suggestions.map((cmd) => (
                  <li key={cmd.trigger} className="flex flex-col p-2 bg-muted rounded-md">
                    <div className="flex items-center space-x-2">
                      <Icon name="chevronRight" className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">"{cmd.trigger}"</span>
                    </div>
                    <span className="text-sm text-muted-foreground ml-6">{cmd.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {pendingAction && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 max-w-md w-full space-y-4">
            <h2 className="text-lg font-semibold">Confirm Action</h2>
            <p>{message}</p>
            <div className="flex space-x-4">
              <Button onClick={confirmAction} className="flex-1">
                <Icon name="check" className="w-4 h-4 mr-2" />
                Confirm
              </Button>
              <Button onClick={cancelAction} variant="outline" className="flex-1">
                <Icon name="close" className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

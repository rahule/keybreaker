import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Share2, Download } from 'lucide-react';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import html2canvas from 'html2canvas';
import { ResultsCard } from './components/ResultsCard';
import { toast, Toaster } from 'sonner';
import Logo from './Logo-Key.svg'; // Make sure this path is correct
import './styles/custom.css';

// Sample texts for the typing test
const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do. Technology has revolutionized the way we communicate and interact with each other in modern society.",
  "Writing code requires patience, practice, and persistence. Every expert was once a beginner who never gave up on their dreams. The journey of a thousand miles begins with a single step forward into the unknown.",
  "Design is not just what it looks like and feels like. Design is how it works and solves real problems for people. Simplicity is the ultimate sophistication in any creative endeavor or complex system.",
  "The best way to predict the future is to create it yourself. Innovation distinguishes between a leader and a follower in any competitive industry. Success is not final and failure is not fatal in the pursuit of excellence.",
  "Learning to type faster improves productivity and efficiency dramatically. Practice makes perfect when it comes to developing any new skill or ability. Consistency is the key to mastering anything worth learning in life.",
  "The internet has connected billions of people across the globe. Information travels at the speed of light through fiber optic cables worldwide. Digital transformation is reshaping industries and creating new opportunities every single day.",
  "Artificial intelligence is changing the landscape of technology rapidly. Machine learning algorithms can now recognize patterns faster than humans. The future belongs to those who embrace change and adapt quickly.",
  "Reading books expands your knowledge and improves your vocabulary significantly. Great literature has the power to transport you to different worlds. Words have the ability to inspire, motivate, and transform lives forever."
];

export default function App() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [typedWords, setTypedWords] = useState<{ word: string; correct: boolean }[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [startTime, setStartTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize test
  const initializeTest = () => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    const words = randomText.split(' ');
    setTargetWords(words);
    setCurrentWordIndex(0);
    setCurrentInput('');
    setTypedWords([]);
    setTimeLeft(30);
    setGameState('idle');
    setStartTime(null);
  };

  useEffect(() => {
    initializeTest();
  }, []);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('finished');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (gameState === 'idle' && value.length > 0) {
      setGameState('playing');
      setStartTime(Date.now());
    }

    if (value.endsWith(' ')) {
      const typedWord = value.trim();
      const targetWord = targetWords[currentWordIndex];
      const isCorrect = typedWord === targetWord;

      setTypedWords([...typedWords, { word: typedWord, correct: isCorrect }]);
      const newIndex = currentWordIndex + 1;
      setCurrentWordIndex(newIndex);
      setCurrentInput('');

      if (newIndex >= targetWords.length) setGameState('finished');
    } else {
      setCurrentInput(value);
    }
  };

  const handleScreenClick = () => {
    if (gameState !== 'finished') inputRef.current?.focus();
  };

  const calculateResults = () => {
    const correctWords = typedWords.filter((w) => w.correct).length;
    const totalWords = typedWords.length;
    const accuracy = totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;
    const timeElapsed = startTime ? (Date.now() - startTime) / 1000 / 60 : 0.5; // minutes
    const wpm = Math.round(correctWords / timeElapsed);
    return { wpm, accuracy, totalWords };
  };

  const isCurrentInputCorrect = () => {
    if (currentWordIndex >= targetWords.length) return true;
    const targetWord = targetWords[currentWordIndex];
    return targetWord.startsWith(currentInput);
  };

  const results = gameState === 'finished' ? calculateResults() : null;

  const downloadResults = async () => {
    const card = document.getElementById('results-card');
    if (!card || !results) return;
    try {
      toast.loading('Generating image...');
      const canvas = await html2canvas(card, { backgroundColor: '#ffffff', scale: 2, logging: false });
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `typespeed-${results.wpm}wpm.png`;
          link.click();
          URL.revokeObjectURL(url);
          toast.success('Downloaded!');
        }
      }, 'image/png');
    } catch (error) {
      toast.error('Failed to generate image');
    }
  };

  const shareToSocial = async (platform: 'whatsapp' | 'twitter' | 'instagram') => {
    const card = document.getElementById('results-card');
    if (!card || !results) return;

    try {
      toast.loading('Generating image...');
      const canvas = await html2canvas(card, { backgroundColor: '#ffffff', scale: 2, logging: false, useCORS: true });
      canvas.toBlob(async (blob) => {
        if (!blob) return toast.error('Failed to generate image');
        const file = new File([blob], `typespeed-${results.wpm}wpm.png`, { type: 'image/png' });
        const text = `I just scored ${results.wpm} WPM with ${results.accuracy}% accuracy on TypeSpeed! 🚀`;
        toast.dismiss();

        // Instagram: share or fallback
        if (platform === 'instagram') {
          if (navigator.share) {
            try { await navigator.share({ files: [file], title: 'TypeSpeed Results', text }); toast.success('Shared successfully!'); return; }
            catch (err: any) { if (err.name !== 'AbortError') console.error(err); }
          }
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `typespeed-${results.wpm}wpm.png`;
          link.click();
          URL.revokeObjectURL(url);
          toast.success('Image downloaded! Upload to Instagram.');
          return;
        }

        // Native share
        if (navigator.share) {
          try { await navigator.share({ files: [file], title: 'TypeSpeed Results', text }); toast.success('Shared successfully!'); return; }
          catch (err: any) { if (err.name !== 'AbortError') console.error(err); }
        }

        // Fallback to URLs
        let shareUrl = '';
        if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        if (shareUrl) { window.open(shareUrl, '_blank', 'width=600,height=400'); toast.success('Opening share dialog...'); }
      }, 'image/png');
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to generate image');
    }
  };

  return (
    <div
      className="min-h-screen bg-white flex flex-col items-center justify-center p-8 cursor-text"
      onClick={handleScreenClick}
    >
      {/* Logo */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <img src={Logo} alt="Logo" className="h-10" />
      </div>

      <AnimatePresence mode="wait">
        {gameState !== 'finished' ? (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl"
          >
            {/* Progress */}
            <div className="mb-16"><Progress value={(timeLeft / 30) * 100} className="h-2" /></div>

            {/* Text */}
            <div className="text-5xl leading-relaxed mb-8 select-none">
              {targetWords.map((word, index) => {
                let className = 'inline-block mr-4 transition-all duration-200';
                if (index < currentWordIndex) className += typedWords[index]?.correct ? ' text-gray-300' : ' text-red-500 line-through';
                else if (index === currentWordIndex) {
                  const isCorrect = isCurrentInputCorrect();
                  className += isCorrect ? ' bg-yellow-100 px-2 rounded' : ' text-red-500 bg-red-50 px-2 rounded';
                  return (
                    <span key={index} className={className}>
                      <span className={isCorrect ? 'text-gray-700' : 'text-red-500'}>{currentInput}</span>
                      <span className="text-gray-300">{word.slice(currentInput.length)}</span>
                    </span>
                  );
                } else className += ' text-gray-700';
                return <span key={index} className={className}>{word}</span>;
              })}
            </div>

            {/* Hidden input */}
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              className="opacity-0 absolute pointer-events-none"
              autoFocus
            />

            {gameState === 'idle' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-400 mt-12 text-xl">
                Click anywhere and start typing...
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl text-center"
            id="results"
          >
            <h1 className="text-5xl mb-12 text-gray-800">Test Complete!</h1>
            <div className="space-y-6 mb-12">
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="text-gray-500 mb-2">Words per Minute</div>
                <div className="text-6xl text-gray-800">{results?.wpm}</div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-2xl p-8">
                  <div className="text-gray-500 mb-2">Accuracy</div>
                  <div className="text-4xl text-gray-800">{results?.accuracy}%</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-8">
                  <div className="text-gray-500 mb-2">Words Typed</div>
                  <div className="text-4xl text-gray-800">{results?.totalWords}</div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mb-4">
              <Button onClick={initializeTest} size="lg" className="gap-2"><RotateCcw className="w-4 h-4" /> Try Again</Button>
              <Button onClick={downloadResults} size="lg" variant="outline" className="gap-2"><Download className="w-4 h-4" /> Download</Button>
            </div>
            <div className="flex justify-center gap-3">
              <Button onClick={() => shareToSocial('whatsapp')} size="sm" variant="outline" className="gap-2"><Share2 className="w-3 h-3" /> WhatsApp</Button>
              <Button onClick={() => shareToSocial('twitter')} size="sm" variant="outline" className="gap-2"><Share2 className="w-3 h-3" /> Twitter</Button>
              <Button onClick={() => shareToSocial('instagram')} size="sm" variant="outline" className="gap-2"><Share2 className="w-3 h-3" /> Instagram</Button>
            </div>

            {/* Hidden results card for image */}
            {results && (
              <div className="hidden" aria-hidden="true" id="results-card">
                <ResultsCard wpm={results.wpm} accuracy={results.accuracy} totalWords={results.totalWords} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="fixed bottom-4 w-full text-center text-xs text-gray-400">Powered by Edathil</div>
      <Toaster />
    </div>
  );
}

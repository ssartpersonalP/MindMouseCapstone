// pages/index.js
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ALPHABET = [
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  ..."0123456789",
  "<Space>",
  "<Backspace>",
  "<Enter>",
];

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const [scrollIndex, setScrollIndex] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollIndex((prev) => (prev + 1) % ALPHABET.length);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // === Poll backend for "click" signal ===
  useEffect(() => {
    const pollClick = async () => {
      try {
        const res = await fetch("http://localhost:8000/click");
        const data = await res.json();
        if (data.clicked) {
          handleSelect(); // Trigger selection on backend signal
        }
      } catch (error) {
        console.error("Error polling click:", error);
      }
    };

    const interval = setInterval(pollClick, 500); // Poll every 500ms
    return () => clearInterval(interval);
  }, []);

  const handleSelect = () => {
    const letter = ALPHABET[scrollIndex];
    if (letter === "<Enter>") {
      setShowPrompt(true);
    } else if (letter === "<Backspace>") {
      setTypedText((prev) => prev.slice(0, -1));
    } else if (letter === "<Space>") {
      setTypedText((prev) => prev + " ");
    } else {
      setTypedText((prev) => prev + letter);
    }
  };

  const handleConfirm = () => {
    const blob = new Blob([typedText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "output.txt";
    link.click();
    setTypedText("");
    setShowPrompt(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="text-2xl mb-4">Typed Text:</div>
      <div className="min-w-[300px] px-4 py-2 border-2 border-black bg-black text-white text-xl rounded-xl">
        {typedText || "..."}
      </div>

      <div className="mt-12 relative h-24 w-full max-w-sm overflow-hidden">
        <motion.div
          className="absolute w-full flex flex-col items-center"
          animate={{ y: -scrollIndex * 60 }}
          transition={{ duration: 0.4 }}
        >
          {ALPHABET.map((letter, i) => (
            <div
              key={i}
              className={`h-[60px] flex items-center justify-center w-full text-3xl font-bold transition-all duration-300 ${
                i === scrollIndex ? "text-red-500 scale-110" : "text-black"
              }`}
            >
              {letter}
            </div>
          ))}
        </motion.div>
      </div>

      <button
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
        onClick={handleSelect}
      >
        Select Letter
      </button>

      {showPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl text-center shadow-xl">
            <div className="text-xl mb-4">Confirm text input?</div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowPrompt(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client'

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnnouncementPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the popup on soft launch (initially)
    const hasSeenPopup = localStorage.getItem('hasSeenAnnouncement');
    if (!hasSeenPopup) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Optionally remember that the user has seen the popup
    localStorage.setItem('hasSeenAnnouncement', 'true');
  };

  const handleOpen = () => {
    setIsVisible(true);
    // Optionally clear the seen status to allow reopening
    localStorage.removeItem('hasSeenAnnouncement');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md p-6 bg-white border-4 border-green-500 shadow-xl retro-card"
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="mb-4 text-xl font-bold text-center text-red-600 retro-heading">
              CITK Admission NOTICE 2025!
            </h2>
            <div className="text-gray-700">
              <p className="mb-2">
                Online applications are invited from eligible candidates for admission to the following programme: DIPLOMA, B.TECH(Bachelor of Technology), B.DES (Bachelor of Design), M.Tech (Master of Technology), M.Des (Master of Design) and PhD (Doctor of Philosophy).
              </p>
              <p className="mb-2">
                The online application process ends on 31st May, 2025.
              </p>
              <p className="mb-4">
                For more information, you can join our webinar:
              </p>
              <p className="text-center">
                <a href="#" className="text-blue-600 hover:underline">
                  [Webinar Link - To be added later]
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 
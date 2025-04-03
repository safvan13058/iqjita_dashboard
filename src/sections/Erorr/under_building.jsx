import React from "react";
import error from '../images/under-build.webp'
import './under_building.css'
const UnderConstruction = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <img
        src={error}
        alt="Under Construction"
        className="w-2/3 max-w-lg mb-4"
      />
      <div className="mt-4 text-lg text-gray-600">
      <h1 className="text-4xl font-bold mb-4">🚧 Sorry, this page is under construction! 🚧</h1>

        <p>"Rome wasn’t built in a day, but we’re working on it!"</p>
        <p>"Good things take time… and a lot of coffee! ☕"</p>
        <p>"This page is loading... just like my motivation on Mondays."</p>
      </div>
    </div>
  );
};
// import React, { useEffect, useState } from "react";
// import error from '../images/under-build.webp';
// import './under_building.css';
// import typingSound from './typing.mp3'; // You'll need to add a typing sound file

// const UnderConstruction = () => {
//   const [displayedText, setDisplayedText] = useState("");
//   const phrases = [
//     "🚧 Sorry, this page is under construction! 🚧",
//     "\"Rome wasn't built in a day, but we're working on it!\"",
//     "\"Good things take time… and a lot of coffee! ☕\"",
//     "\"This page is loading... just like my motivation on Mondays.\""
//   ];
//   const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
//   const [isTyping, setIsTyping] = useState(true);

//   useEffect(() => {
//     const audio = new Audio(typingSound);
//     audio.volume = 0.10; // Lower the volume so it's not annoying

//     let timeout;
    
//     if (isTyping) {
//       audio.play().catch(e => console.log("Audio play failed:", e));
      
//       if (displayedText.length < phrases[currentPhraseIndex].length) {
//         timeout = setTimeout(() => {
//           setDisplayedText(phrases[currentPhraseIndex].substring(0, displayedText.length + 1));
//         }, 50 + Math.random() * 50); // Random typing speed variation
//       } else {
//         audio.pause();
//         setIsTyping(false);
//         // Move to next phrase after a delay
//         timeout = setTimeout(() => {
//           setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length);
//           setDisplayedText("");
//           setIsTyping(true);
//         }, 3000);
//       }
//     }

//     return () => {
//       clearTimeout(timeout);
//       audio.pause();
//     };
//   }, [displayedText, isTyping, currentPhraseIndex]);

//   return (
//     <div className="under-construction-container">
//       <img
//         src={error}
//         alt="Under Construction"
//         className="construction-image"
//       />
//       <div className="typing-text">
//         <h1 className={currentPhraseIndex === 0 ? "main-heading" : "sub-text"}>
//           {displayedText}
//           <span className="cursor">|</span>
//         </h1>
//       </div>
//     </div>
//   );
// };

// export default UnderConstruction;
export default UnderConstruction;

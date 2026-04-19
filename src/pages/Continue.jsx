import Letter from "../components/Letter";
import Example from "../components/Example";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Camera from "../components/Camera";
function Continue() {
   const [detectedLetter, setDetectedLetter] = useState("");
      const [nextUnlocked, setNextUnlocked] = useState(false);
      let letters = [
         "A",
         "B",
         "C",
         "D",
         "E",
         "F",
         "G",
         "H",
         "I",
         "J",
         "K",
         "L",
         "M",
         "N",
         "O",
         "P",
         "Q",
         "R",
         "S",
         "T",
         "U",
         "V",
         "W",
         "X",
         "Y",
         "Z",
      ];
      let pictures = [
         "/src/assets/A.png",
         "/src/assets/B.png",
         "/src/assets/C.png",
         "/src/assets/D.png",
         "/src/assets/E.png",
         "/src/assets/F.png",
         "/src/assets/G.png",
         "/src/assets/H.png",
         "/src/assets/I.png",
         "/src/assets/J.png",
         "/src/assets/K.png",
         "/src/assets/L.png",
         "/src/assets/M.png",
         "/src/assets/N.png",
         "/src/assets/O.png",
         "/src/assets/P.png",
         "/src/assets/Q.png",
         "/src/assets/R.png",
         "/src/assets/S.png",
         "/src/assets/T.png",
         "/src/assets/U.png",
         "/src/assets/V.png",
         "/src/assets/W.png",
         "/src/assets/X.png",
         "/src/assets/Y.png",
         "/src/assets/Z.png",
      ];
    const shuffle = (arr) => {
      let shuffled = [...arr]
      for (let i = shuffled.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
   }

   const [shuffledLetters] = useState(() => shuffle(letters))
        const [index, setIndex] = useState(0);
      const [button, setButton] = useState(false);
      const nav = useNavigate();
      function handleClick() {
         const nextIndex = index + 1
         setIndex(nextIndex)
         setButton(false);
        if (index === shuffledLetters.length - 1) {
            nav('/coursecomplete')
            return
         }
         // reset unlock/letter state
         setNextUnlocked(false);
         setDetectedLetter("");
         setIndex(nextIndex);
      }
      function showPic() {
         setButton(true);
      }
      function handleDetect(letter) {
         setDetectedLetter(letter)
         if (letter === shuffledLetters[index]) {
         setNextUnlocked(true)
      }
   }
   
      return (
         <>
            <div>
               <Letter letter={shuffledLetters[index]} />
               <Camera key={shuffledLetters[index]} onDetect={handleDetect} />
               <button onClick={handleClick} disabled={!nextUnlocked}>Next</button>
               <button onClick={showPic}>Don't Know?</button>
               {button && <Example pic={pictures[letters.indexOf(shuffledLetters[index])]} />}
            </div>
         </>
      );
}
export default Continue;

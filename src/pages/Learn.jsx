import Letter from "../components/Letter";
import Example from "../components/Example";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Camera from "../components/Camera";

function Learn() {
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

   const [index, setIndex] = useState(0);
   const nav = useNavigate();

   function handleClick() {
      const endCheckpoint = (index + 1) % 3 === 0;
      const lastLetter = index === letters.length - 1;

      if (endCheckpoint || lastLetter) {
         nav("/checkpoint", { state: { index } }); // name source for checkpoint
         return;
      }

      // reset unlock/letter state
      setNextUnlocked(false);
      setDetectedLetter("");
      setIndex(index + 1);
   }

   function handleDetect(letter) {
      setDetectedLetter(letter);

      if (letter === letters[index]) {
         setNextUnlocked(true);
      }
   }

   return (
      <>
         <div>
            <Camera key={letters[index]} onDetect={handleDetect} />
            <Letter letter={letters[index]} />
            <Example pic={pictures[index]} />
            <button onClick={handleClick} disabled={!nextUnlocked}>
               Next
            </button>
         </div>
      </>
   );
}
export default Learn;

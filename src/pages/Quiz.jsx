import Letter from "../components/Letter";
import Example from "../components/Example";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Camera from "../components/Camera";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

function Quiz() {
   const [detectedLetter, setDetectedLetter] = useState("");
   const [nextUnlocked, setNextUnlocked] = useState(false);

   const letters = [
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

   const pictures = [
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

   const startIndex = (Number(localStorage.getItem("letterIndex")) || 0) - 3;
   const [index, setIndex] = useState(startIndex);
   const [button, setButton] = useState(false);
   const nav = useNavigate();

   function handleClick() {
      const nextIndex = index + 1;
      const endCheckpoint = (index + 1) % 3 === 0;
      const lastLetter = index === letters.length - 1;

      setButton(false);

      if (endCheckpoint || lastLetter) {
         localStorage.setItem("quizDone", "true");
         nav("/checkpoint");
         return;
      }

      setNextUnlocked(false);
      setDetectedLetter("");
      setIndex(nextIndex);
   }

   function showPic() {
      setButton(true);
   }

   function handleDetect(letter) {
      setDetectedLetter(letter);
      if (letter === letters[index]) {
         setNextUnlocked(true);
      }
   }

   return (
      <Container maxWidth={false} sx={{ py: 4 }}>
         <Box
            sx={{
               display: "flex",
               justifyContent: "space-between",
               alignItems: "flex-start",
               px: 4,
               gap: 4,
            }}
         >
            {/* LEFT: CAMERA */}
            <Box sx={{ flex: 1 }}>
               <Camera key={letters[index]} onDetect={handleDetect} />

               {/* BUTTONS */}
               <Box
                  sx={{
                     mt: 2,
                     display: "flex",
                     justifyContent: "center",
                     gap: 2,
                  }}
               >
                  <Button onClick={handleClick} disabled={!nextUnlocked}>
                     Next
                  </Button>
                  <Button onClick={showPic}>Don&apos;t Know?</Button>
               </Box>
            </Box>

            {/* RIGHT: LETTER + IMAGE */}
            <Box
               sx={{
                  width: "380px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  alignItems: "center",
               }}
            >
               <Letter letter={letters[index]} />
               {button && <Example pic={pictures[index]} />}
            </Box>
         </Box>
      </Container>
   );
}

export default Quiz;

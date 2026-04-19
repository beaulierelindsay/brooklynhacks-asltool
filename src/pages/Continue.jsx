import Letter from "../components/Letter";
import Example from "../components/Example";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Camera from "../components/Camera";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

function Continue() {
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

   const shuffle = (arr) => {
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
   };

   const [shuffledLetters] = useState(() => shuffle(letters));
   const [index, setIndex] = useState(0);
   const [button, setButton] = useState(false);
   const nav = useNavigate();

   function handleClick() {
      const nextIndex = index + 1;
      setButton(false);

      if (index === shuffledLetters.length - 1) {
         nav("/coursecomplete");
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
      if (letter === shuffledLetters[index]) {
         setNextUnlocked(true);
      }
   }

   return (
      <Container maxWidth={false} sx={{ py: 4 }}>
         <Typography
            variant="h2"
            sx={{
               textAlign: "center",
               mb: 3,
               color: "info.main",
            }}
         >
            Final Exam
         </Typography>

         <Box
            sx={{
               display: "flex",
               justifyContent: "space-between",
               alignItems: "flex-start",
               gap: 4,
               px: 4,
            }}
         >
            <Box sx={{ flex: 1, minWidth: 0 }}>
               <Camera key={shuffledLetters[index]} onDetect={handleDetect} />

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

            <Box
               sx={{
                  width: "380px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  alignItems: "center",
                  flexShrink: 0,
               }}
            >
               <Letter letter={shuffledLetters[index]} />
               {button && (
                  <Example
                     pic={pictures[letters.indexOf(shuffledLetters[index])]}
                  />
               )}
            </Box>
         </Box>
      </Container>
   );
}

export default Continue;

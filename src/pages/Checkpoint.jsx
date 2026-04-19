import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

function Checkpoint() {
   const nav = useNavigate();
   const [quizDone, setQuizDone] = useState(
      localStorage.getItem("quizDone") === "true",
   );
   const studyAgain = () => {
      const current = Number(localStorage.getItem("letterIndex")) || 0;
      const backThree = current - 3;
      localStorage.setItem("letterIndex", backThree);
      localStorage.setItem("quizDone", "false");
      setQuizDone(false);
      nav("/learn");
   };
   const takeQuiz = () => {
      nav("/quiz");
   };
   const continueLearn = () => {
      localStorage.setItem("quizDone", "false");
      setQuizDone(false);
      nav("/learn");
   };
   return (
      <Container>
         <Box>
            <Typography variant="h1">Good Job!</Typography>
            <Button onClick={takeQuiz}>Take Quiz</Button>
            <Button onClick={studyAgain}>Keep Practicing</Button>
            {quizDone && <Button onClick={continueLearn}>Continue</Button>}
         </Box>
      </Container>
   );
}
export default Checkpoint;

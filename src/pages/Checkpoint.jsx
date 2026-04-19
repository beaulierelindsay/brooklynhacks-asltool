import { useNavigate, } from "react-router-dom";
import { useState } from 'react'

function Checkpoint() {
   const nav = useNavigate()
   const [quizDone, setQuizDone] = useState(localStorage.getItem('quizDone') === 'true')
   const studyAgain = () => {
      const current = Number(localStorage.getItem('letterIndex')) || 0
      const backThree = current - 3
      localStorage.setItem('letterIndex', backThree)
      localStorage.setItem('quizDone', 'false')
      setQuizDone(false)
      nav('/learn')
   }
   const takeQuiz = ()=>{
      nav('/quiz')
   }
   const continueLearn = () => {
      localStorage.setItem('quizDone', 'false')
      setQuizDone(false)
      nav('/learn')
   }
   return <>
      <div>
         <h1><b>GOOD JOB!</b></h1>
         <button onClick={takeQuiz}>Take Quiz</button>
         <button onClick={studyAgain}>Keep Practicing</button>
         {quizDone && <button onClick={continueLearn}>Continue</button>}
      </div>
   </>;
}
export default Checkpoint;

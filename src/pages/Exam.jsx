import { useNavigate } from "react-router-dom";

function Exam() {
   const nav = useNavigate()
   const finalExam = ()=>{
     nav('/quiz')
   } /* MAKE A NEW PAGE FOR FINAL EXAM */
   const practice = ()=>{
     nav('/learn')
  }
   return <>
      <div>
         <h1>FINAL BOSS!</h1>
         <button onClick={finalExam}>Take Final Quiz</button>
         <button onClick={practice}>Keep Practicing</button>
      </div>
   </>;
}
export default Exam;

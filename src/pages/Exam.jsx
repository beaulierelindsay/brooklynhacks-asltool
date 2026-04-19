import { useNavigate } from "react-router-dom";

function Exam() {
   const nav = useNavigate()
   const finalExam = () => {
      nav('/continue')
   }
   return <>
      <div>
         <h1>FINAL BOSS!</h1>
         <button onClick={finalExam}>Take Final Quiz</button>
      </div>
   </>;
}
export default Exam;

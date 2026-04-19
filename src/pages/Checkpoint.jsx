import { useNavigate, } from "react-router-dom";

function Checkpoint() {
   const nav = useNavigate()
   const quiz = ()=>{
      nav('/quiz')
   }
   const practice = ()=>{
     nav('/learn')
  }
   return <>
      <div>
         <h1><b>GOOD JOB!</b></h1>
         <button onClick={quiz}>Take Quiz</button>
         <button onClick={practice}>Keep Practicing</button>

      </div>
   </>;
}
export default Checkpoint;

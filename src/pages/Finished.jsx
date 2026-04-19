import { useNavigate } from "react-router-dom";

function Finished() {
   const nav = useNavigate()
   const startAgain = ()=>{
     nav('/')
  }
   return <>
      <div>
         <h1>CONGRATULATIONS!!!</h1>
         <button onClick={startAgain}>START OVER</button>
      </div>
   </>;
}
export default Finished;

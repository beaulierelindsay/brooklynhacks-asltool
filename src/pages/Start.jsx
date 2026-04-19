import { useNavigate } from "react-router-dom";

function Start() {
  const nav = useNavigate()
  const learn = ()=>{
     nav('/learn')
  }

   return (
      <>
         <div>
            <h1>NAME</h1>
            <button onClick={learn}>START</button>
            <p>Learn the ASL alphabet in real time</p>
         </div>
      </>
   )
}
export default Start;

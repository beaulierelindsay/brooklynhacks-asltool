import Letter from '../components/Letter'
import Example from '../components/Example'
import { useState } from 'react'
import {useNavigate} from "react-router-dom";

function Quiz() {
   let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      let pictures = ['/src/assets/A.png', '/src/assets/B.png', '/src/assets/C.png', '/src/assets/D.png', '/src/assets/E.png', '/src/assets/F.png', '/src/assets/G.png', '/src/assets/H.png', '/src/assets/I.png', '/src/assets/J.png', '/src/assets/K.png', '/src/assets/L.png', '/src/assets/M.png', '/src/assets/N.png', '/src/assets/O.png', '/src/assets/P.png', '/src/assets/Q.png', '/src/assets/R.png', '/src/assets/S.png', '/src/assets/T.png', '/src/assets/U.png', '/src/assets/V.png', '/src/assets/W.png', '/src/assets/X.png', '/src/assets/Y.png', '/src/assets/Z.png']
   const [index, setIndex] = useState(0)
   const [button, setButton] = useState(false)
      const nav = useNavigate()
      function handleClick() {
         setIndex(index + 1)
         setButton(false)
         if ((index + 1) % 3 == 0) {
            nav('/checkpoint')
         }
      }
   function showPic() {
         setButton(true)
      }
         return <>
            <div>
               <Letter letter={letters[index]} />
               <button onClick={handleClick}>Next</button>
               <button onClick={showPic}>Don't Know?</button>
               {button && <Example pic={pictures[index]}/>}
            </div>
   </>;
}
export default Quiz;

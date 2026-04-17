import { Routes, Route } from "react-router-dom";

import {
   Continue,
   Exam,
   Finished,
   Learn,
   Checkpoint,
   Start,
   Quiz,
} from "./pages";

function App() {
   return (
      <Routes>
         <Route index element={<Start />} />
         <Route path="checkpoint" element={<Checkpoint />} />
         <Route path="continue" element={<Continue />} />
         <Route path="learn" element={<Learn />} />
         <Route path="quiz" element={<ProfilePage />} />
         <Route path="coursecomplete" element={<Finished />} />
         <Route path="finalexam" element={<Exam />} />
      </Routes>
   );
}

export default App;

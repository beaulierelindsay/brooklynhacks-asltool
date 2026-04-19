import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

function Exam() {
   const nav = useNavigate();

   const finalExam = () => {
      nav("/continue");
   };

   return (
      <Container maxWidth="sm">
         <Box
            sx={{
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
               justifyContent: "center",
               textAlign: "center",
               minHeight: "100vh",
               gap: 3,
            }}
         >
            <Typography variant="h1">FINAL BOSS!</Typography>

            <Button onClick={finalExam}>Take Final Quiz</Button>
         </Box>
      </Container>
   );
}

export default Exam;

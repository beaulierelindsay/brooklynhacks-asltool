import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";

function Finished() {
   const nav = useNavigate();

   const restart = () => {
      localStorage.setItem("letterIndex", 0);
      localStorage.setItem("quizDone", "false");
      nav("/");
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
            <Typography variant="h1" color="info.main">
               CONGRATULATIONS!!!
            </Typography>

            <Button onClick={restart}>Start Over</Button>
         </Box>
      </Container>
   );
}

export default Finished;

import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import "@fontsource/comfortaa";

function Start() {
   const nav = useNavigate();
   const learn = () => {
      nav("/learn");
   };

   return (
      <Container maxWidth="sm">
         <Box
            component="section"
            sx={{
               display: "flex",
               flexDirection: "column",
               alignItems: "center", // 👈 horizontal center
               justifyContent: "center", // 👈 vertical center
               textAlign: "center",
               minHeight: "100vh", // 👈 full screen height
               gap: 3, // 👈 spacing between elements
            }}
         >
            <Typography variant="h1">SelfSign</Typography>

            <Button onClick={learn}>START</Button>

            <Typography variant="subtitle1">
               Learn the ASL alphabet in real time
            </Typography>
         </Box>
      </Container>
   );
}

export default Start;

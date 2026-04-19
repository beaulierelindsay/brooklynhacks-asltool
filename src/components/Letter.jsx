import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function Letter({ letter }) {
   return (
      <Box
         sx={{
            width: "350px",
            height: "320px",
            border: "5px solid",
            borderColor: "info.main", //
            backgroundColor: "rgba(255,255,255,0.8)", //
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            position: "absolute",
            right: "25px",
            top: "25px",
            boxShadow: 3,
         }}
      >
         <Typography
            variant="h1"
            sx={{
               fontSize: "220px",
               fontWeight: "bold",
               color: "info.main", // 💙 blue letter
            }}
         >
            {letter}
         </Typography>
      </Box>
   );
}

export default Letter;

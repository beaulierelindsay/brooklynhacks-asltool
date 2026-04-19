import Box from "@mui/material/Box";

function Example({ pic }) {
   return (
      <Box
         sx={{
            width: "350px",
            height: "300px",
            border: "5px solid",
            borderColor: "info.main", // 💙 blue outline
            backgroundColor: "rgba(255,255,255,0.8)", // 🤍 translucent
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            position: "absolute",
            right: "25px",
            top: "360px",
            boxShadow: 3,
         }}
      >
         <Box
            component="img"
            src={pic}
            sx={{
               width: "100%",
               height: "100%",
               objectFit: "contain",
            }}
         />
      </Box>
   );
}

export default Example;

import { Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
   Exam,
   Finished,
   Learn,
   Checkpoint,
   Start,
   Quiz,
   Continue,
} from "./pages";
import "@fontsource/comfortaa/300.css";
import "@fontsource/comfortaa/400.css";
import "@fontsource/comfortaa/500.css";
import "@fontsource/comfortaa/700.css";
// define a theme for text
const theme = createTheme({
   palette: {
      primary: {
         main: "#f8b4c8", // light pink for buttons
         contrastText: "#ffffff",
      },
      secondary: {
         main: "#ffe5a5", // butter yellow background/accent
      },
      info: {
         main: "#8ecae6", // light blue for letters/outlines
      },
      background: {
         default: "#fff4cc",
         paper: "rgba(255, 255, 255, 0.8)",
      },
   },
   typography: {
      fontFamily: "Comfortaa, cursive",
      h1: {
         fontWeight: 700,
      },
      subtitle1: {
         fontWeight: 700,
      },
   },
   components: {
      MuiButton: {
         defaultProps: {
            variant: "contained",
            color: "primary",
            size: "large",
         },
         styleOverrides: {
            root: {
               borderRadius: "12px",
               textTransform: "none",
            },
         },
      },
      MuiCssBaseline: {
         styleOverrides: {
            body: {
               backgroundColor: "#fff4cc",
               backgroundImage: `
      repeating-linear-gradient(
         0deg,
         rgba(255, 230, 170, 0.3),
         rgba(255, 230, 170, 0.3) 2px,
         transparent 2px,
         transparent 20px
      ),
      repeating-linear-gradient(
         90deg,
         rgba(255, 230, 170, 0.3),
         rgba(255, 230, 170, 0.3) 2px,
         transparent 2px,
         transparent 20px
      )
   `,
            },
         },
      },
   },
});
function App() {
   return (
      <ThemeProvider theme={theme}>
         <CssBaseline />
         <Routes>
            <Route path="/" element={<Start />} />
            <Route path="checkpoint" element={<Checkpoint />} />
            <Route path="continue" element={<Continue />} />
            <Route path="learn" element={<Learn />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="coursecomplete" element={<Finished />} />
            <Route path="finalexam" element={<Exam />} />
         </Routes>
      </ThemeProvider>
   );
}

export default App;

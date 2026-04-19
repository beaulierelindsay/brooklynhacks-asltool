import { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { detectLetter } from "../ASLRules";

const HAND_CONNECTIONS = [
   [0, 1],
   [1, 2],
   [2, 3],
   [3, 4],
   [0, 5],
   [5, 6],
   [6, 7],
   [7, 8],
   [0, 9],
   [9, 10],
   [10, 11],
   [11, 12],
   [0, 13],
   [13, 14],
   [14, 15],
   [15, 16],
   [0, 17],
   [17, 18],
   [18, 19],
   [19, 20],
   [5, 9],
   [9, 13],
   [13, 17],
];

function Camera({ onDetect }) {
   const videoRef = useRef(null);
   const handLandmarkerRef = useRef(null);
   const animationFrameRef = useRef(null);

   const [detectedLetter, setDetectedLetter] = useState("");

   // Motion history for J and Z
   const motionHistoryRef = useRef({
      index: [],
      pinky: [],
   });

   useEffect(() => {
      let stream;
      let lastVideoTime = -1;

      async function setup() {
         try {
            stream = await navigator.mediaDevices.getUserMedia({
               video: true,
               audio: false,
            });

            if (!videoRef.current) return;

            videoRef.current.srcObject = stream;

            const vision = await FilesetResolver.forVisionTasks(
               "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
            );

            handLandmarkerRef.current = await HandLandmarker.createFromOptions(
               vision,
               {
                  baseOptions: {
                     modelAssetPath: "/models/hand_landmarker.task",
                  },
                  runningMode: "VIDEO",
                  numHands: 1,
               },
            );

            console.log("HandLandmarker loaded");

            const detectHands = () => {
               if (!videoRef.current || !handLandmarkerRef.current) {
                  animationFrameRef.current =
                     requestAnimationFrame(detectHands);
                  return;
               }

               const video = videoRef.current;

               if (!video.videoWidth || !video.videoHeight) {
                  animationFrameRef.current =
                     requestAnimationFrame(detectHands);
                  return;
               }

               if (video.currentTime !== lastVideoTime) {
                  const results = handLandmarkerRef.current.detectForVideo(
                     video,
                     performance.now(),
                  );

                  lastVideoTime = video.currentTime;

                  if (results.landmarks && results.landmarks.length > 0) {
                     const hand = results.landmarks[0];

                     // Track motion points for Z (index tip) and J (pinky tip)
                     const now = performance.now();

                     // Add raw points
                     motionHistoryRef.current.index.push({
                        x: hand[8].x,
                        y: hand[8].y,
                        t: now,
                     });

                     motionHistoryRef.current.pinky.push({
                        x: hand[20].x,
                        y: hand[20].y,
                        t: now,
                     });

                     // keep only recent points
                     motionHistoryRef.current.index =
                        motionHistoryRef.current.index.filter(
                           (p) => now - p.t < 1200,
                        );
                     motionHistoryRef.current.pinky =
                        motionHistoryRef.current.pinky.filter(
                           (p) => now - p.t < 1200,
                        );
                     const detected = detectLetter(
                        hand,
                        motionHistoryRef.current,
                     );
                     setDetectedLetter(detected);

                     // after detecting call the function to pass all current letter for future check in learn/quiz
                     if (onDetect) {
                        onDetect(detected);
                     }
                  } else {
                     setDetectedLetter("");
                     motionHistoryRef.current.index = [];
                     motionHistoryRef.current.pinky = [];
                     if (onDetect) {
                        onDetect("");
                     }
                  }
               }

               animationFrameRef.current = requestAnimationFrame(detectHands);
            };

            detectHands();
         } catch (error) {
            console.error("Setup error:", error);
         }
      }

      setup();

      return () => {
         if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
         }

         if (stream) {
            stream.getTracks().forEach((track) => track.stop());
         }
      };
   }, []);

   return (
      <div>
         <div
            style={{
               position: "relative",
               width: "500px",
               height: "375px",
            }}
         >
            <video
               ref={videoRef}
               autoPlay
               playsInline
               muted
               style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: "scaleX(-1)",
               }}
            />
         </div>

         <div
            style={{ marginTop: "12px", fontSize: "24px", fontWeight: "bold" }}
         ></div>
      </div>
   );
}

export default Camera;

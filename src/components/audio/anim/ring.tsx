
import { useEffect, useRef } from "react";

export interface AudioVisComponentProps {
    stream: MediaStream;
    agentState?: string
}

export default function VoiceVisualizer({stream }: AudioVisComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);


  useEffect(() => {
    const startVisualizer = async () => {
        if (!stream || !canvasRef.current) return;

      // Initialize AudioContext and AnalyserNode
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 256; // Adjust the resolution of the frequency data
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);

      // Save references
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      const width = canvas.width;
      const height = canvas.height;

      const draw = () => {
        analyser.getByteFrequencyData(dataArray);

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw visualizer
        ctx.beginPath();
        ctx.strokeStyle = "cyan";
        ctx.lineWidth = 3;

        const radius = 100; // Base radius of the circle
        const centerX = width / 2;
        const centerY = height / 2;
        
        const bufLen = bufferLength/3;

        let prevX = centerX + radius; // Initial point x
        let prevY = centerY;          // Initial point y

        for (let i = 0; i < bufLen; i++) {
          const angle = (i / bufLen) * Math.PI * 2;
          const amplitude = dataArray[i] / 255.0 ;
          const r = radius + amplitude * 50;

          const x = centerX + r * Math.cos(angle);
          const y = centerY + r * Math.sin(angle);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
            // Use quadratic curve to smoothen the path
            // const midX = (prevX + x) / 2;
            // const midY = (prevY + y) / 2;
            // ctx.quadraticCurveTo(prevX, prevY, midX, midY);
          }

          prevX = x;
          prevY = y;
        }

        ctx.closePath();
        ctx.stroke();

        // Loop animation
        animationRef.current = requestAnimationFrame(draw);
      };

      draw();
    };

    startVisualizer();

    return () => {
      // Cleanup
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "" }}>
      <canvas ref={canvasRef} width={600} height={600} style={{ border: "1px solid white" }} />
    </div>
  );
}

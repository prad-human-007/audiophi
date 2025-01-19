
import React, { useEffect, useRef, useState } from 'react';

export interface AudioVisComponentProps {
    stream: MediaStream;
    agentState?: string
}

export function BubbleRing({stream }: AudioVisComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    

    
        
      if (!stream || !canvasRef.current) return;
      
      const audioContext = new window.AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      source.connect(analyser);


      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 300;
      canvas.height = 300;

      let cnt=0;
      let bubbles: any = [];
      let angle = Math.random()
      let offset = Math.random()
      let secOffset = Math.random()

      const draw = () => {
          
          analyser.getByteFrequencyData(dataArray);

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fillStyle = 'rgba(105, 217, 255, 0.85)';
          ctx.lineWidth = 2;

          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = 50;
          const numBubbles = 30;
          

          bubbles = Array.from({ length: numBubbles }).map(( _ , idx ) => ({
              angle: angle + idx/numBubbles * 2 * Math.PI,
              offset: offset ,
          }));
          angle += 0.01;
          offset = Math.sin(cnt / 5) * 10;
          secOffset = Math.sin(cnt / 10) * 10;

          
          
          cnt++;

          bubbles.forEach((bubble: any) => {
              const loudness = dataArray ? dataArray[0] / 255 : 0;
              const dynamicRadius = radius + bubble.offset + loudness * 50;

              const x = centerX + dynamicRadius * Math.cos(bubble.angle);
              const y = centerY + dynamicRadius * Math.sin(bubble.angle);

              ctx.beginPath();
              ctx.arc(x, y, 5 + loudness * 2, 0, 2 * Math.PI);
              ctx.fill();
              ctx.stroke();
          });

          requestAnimationFrame(draw);
      };

      draw();

    return () => {
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [stream]);

  return (
    <div>
      <canvas ref={canvasRef}/>
    </div>
  );
};

export default BubbleRing;

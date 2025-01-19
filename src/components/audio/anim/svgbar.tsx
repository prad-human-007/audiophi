import { useEffect, useRef } from "react";

export interface AudioVisComponentProps {
    stream: MediaStream;
    agentState?: string
}

export function SvgBar({ stream }: AudioVisComponentProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!stream) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const audioSource = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 64; // Adjust for the number of bars
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    audioSource.connect(analyser);

    const svg = svgRef.current;
    if (!svg) return;

    const bars = Array.from({ length: bufferLength }, (_, i) => {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", (i * 10).toString()); // Spacing between bars
      rect.setAttribute("y", "100");
      rect.setAttribute("width", "8");
      rect.setAttribute("height", "0");
      rect.setAttribute("fill", "#3399FF");
      svg.appendChild(rect);
      return rect;
    });

    const animate = () => {
      analyser.getByteFrequencyData(dataArray);

      bars.forEach((bar, i) => {
        const value = dataArray[i];
        bar.setAttribute("y", (100 - value / 2).toString()); // Adjust y based on value
        bar.setAttribute("height", (value / 2).toString()); // Adjust height based on value
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      audioContext.close();
    };
  }, [stream]);

  return (
    <svg
      ref={svgRef}
      width="640"
      height="100"
      style={{ display: "block", margin: "0 auto" }}
    ></svg>
  );
}

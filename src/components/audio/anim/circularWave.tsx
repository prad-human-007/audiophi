import { useEffect, useRef } from "react";

export interface AudioVisComponentProps {
  stream: MediaStream;
}

export function CircularWave({ stream }: AudioVisComponentProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!stream) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const audioSource = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 128; // Higher FFT size for smoother animation
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    audioSource.connect(analyser);

    const svg = svgRef.current;
    if (!svg) return;

    const centerX = 320; // Center of the SVG
    const centerY = 320;
    const radius = 150; // Radius of the base circle

    const maxAmplitude = 255; // Max value for Uint8Array

    // Create the wave segments (lines)
    const points = Array.from({ length: bufferLength }, (_, i) => {
      const angle = (i / bufferLength) * Math.PI * 2; // Angle in radians
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x.toString());
      line.setAttribute("y1", y.toString());
      line.setAttribute("x2", x.toString());
      line.setAttribute("y2", y.toString()); // Initially the same as x1, y1
      line.setAttribute("stroke", "#3399FF");
      line.setAttribute("stroke-width", "2");
      svg.appendChild(line);

      return { line, angle };
    });

    const animate = () => {
      analyser.getByteFrequencyData(dataArray);

      // Normalize and apply scaling
      const scaledData = dataArray.map((value, i) => {
        const normalized = value / maxAmplitude; // Normalize to range 0-1
        const scalingFactor = Math.log10(1 + i) + 1; // Boost high frequencies
        return normalized * scalingFactor * 100; // Scale the value
      });

      points.forEach(({ line, angle }, i) => {
        const value = scaledData[i];
        const x2 = centerX + (radius + value) * Math.cos(angle);
        const y2 = centerY + (radius + value) * Math.sin(angle);

        line.setAttribute("x2", x2.toString());
        line.setAttribute("y2", y2.toString());
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      audioContext.close();
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild); // Clean up SVG elements
      }
    };
  }, [stream]);

  return (
    <svg
      ref={svgRef}
      width="640"
      height="640"
      style={{ display: "block", margin: "0 auto"}}
    ></svg>
  );
}

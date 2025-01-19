import { useRef, useEffect } from "react";


export interface AudioVisComponentProps {
    stream: MediaStream;
    agentState?: string
}

export function AudioBars({stream, agentState}: AudioVisComponentProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const offsetX = useRef(0);
    const agentStateRef = useRef(agentState);

    console.log('[VIS-COMP] STREAM IN VIS COMP: ', stream)

    useEffect(() => {
    console.log('AGENT STATE HAS BEEN CHANGED TO, ', agentState)
    agentStateRef.current = agentState? agentState : 'speaking';
    }, [agentState])

    useEffect(() => {

        console.log('AUDIO VIS STREAM: ', stream)

        if(!stream || !canvasRef.current) return;

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const audioCtx = new AudioContext();
        const audioSource = audioCtx.createMediaStreamSource(stream);
        

        // Create an AnalyserNode for audio analysis
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256; // Controls the number of bars
        const bufferLength = analyser.frequencyBinCount; // Half of fftSize
        const dataArray = new Uint8Array(bufferLength);

        // Connect the source to the analyser
        audioSource.connect(analyser);

        // Visualization logic
        const draw = () => {
            if (!canvas || !ctx) return;

            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Get frequency data
            getFreqData(dataArray, analyser);
            // analyser.getByteFrequencyData(dataArray);

            // Draw the bars
            const barWidth = (canvas.width / bufferLength) * 1.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
            barHeight = (dataArray[i]/255) * canvas.height;
            ctx.fillStyle = `rgb(${barHeight}, 150, 255)`;
            ctx.fillRect(x, canvas.height - barHeight , barWidth, barHeight);
            x += barWidth + 1;
            }

            // Loop the animation
            requestAnimationFrame(draw);
        };

        draw();

        // Cleanup resources
        return () => {
            audioSource.disconnect();
            analyser.disconnect();
            if (audioCtx) {
            audioCtx.close();
            }
        };
    }, [stream]);

    function getFreqData(dataArray: Uint8Array, analyser: AnalyserNode) {
        if(agentStateRef.current === 'connecting'){

        }
        else if(agentStateRef.current === 'speaking') {
            analyser.getByteFrequencyData(dataArray);
        }
        else if(agentStateRef.current === 'listening' || agentStateRef.current === 'thinking') {
            for(let i=0; i<dataArray.length; i++) {
            dataArray[i] = Math.sin((i + offsetX.current) * 0.05) * 50 + 100;
            }
            offsetX.current += 2;
        }
        else if(agentStateRef.current === 'disconnected') {
            for(let i=0; i<dataArray.length; i++) {
            dataArray[i] = 0;
            }
        }
    
    }

    return (
        <div className="">
          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            style={{ width: "100%", height: "200px", }}
          ></canvas>
        </div>
      );
}
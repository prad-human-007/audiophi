import { useEffect, useState } from "react"
import { visualizerRegistery, VisualizerType } from "./visualizarRegistery";

interface VisualizerProps {
    type: VisualizerType;
}

export default function AudioVisualizer({ type }: VisualizerProps) {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const VisualizerComponent = visualizerRegistery[type];
    
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({audio: true})
            .then((stream: MediaStream) => setStream(stream))
            .catch((err) => console.error(err))

    }, [])
    return(
        <div>
            <VisualizerComponent stream={stream!}/>
            {/* <AudioBars stream={stream!}/> */}
        </div>
    )
}
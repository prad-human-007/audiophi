import AudioVisualizer from "../components/audio/audioVisualizer"
import { Button } from "../components/ui/button"

export default function Landing() {

    return (
        <div className='flex flex-col gap-4 w-full h-screen justify-center items-center '>
        <AudioVisualizer type="bubble-ring" />
        <h1>Audiophi Landing</h1>
        <Button>Hello</Button>
        </div>
    )
}
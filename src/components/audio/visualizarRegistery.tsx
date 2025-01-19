import { AudioBars } from "./anim/bars";
import { CircleAnim } from "./anim/circle"; 

export const visualizerRegistery = {
    bars: AudioBars,
    circle: CircleAnim
}

export type VisualizerType = keyof typeof visualizerRegistery;
import { AudioBars } from "./anim/bars";
import BubbleRing from "./anim/bubbles";
import { CircleAnim } from "./anim/circle"; 

export const visualizerRegistery = {
    'bars': AudioBars,
    'circle': CircleAnim,
    'bubble-ring': BubbleRing,
}


export type VisualizerType = keyof typeof visualizerRegistery;
import { AudioBars } from "./anim/bars";
import BubbleRing from "./anim/bubbles";
import { CircleAnim } from "./anim/circle"; 
import { CircularWave } from "./anim/circularWave";
import { SvgBar } from "./anim/svgbar";

export const visualizerRegistery = {
    'bars': AudioBars,
    'circle': CircleAnim,
    'bubble-ring': BubbleRing,
    'svg-bar': SvgBar,
    'circular-wave': CircularWave
}


export type VisualizerType = keyof typeof visualizerRegistery;
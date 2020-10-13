import kickDrum from './sounds/kicks/kick01.wav'
import snareDrum from './sounds/snares/snare01.wav'
import clap from './sounds/snares/clap01.wav'
import openHigh from './sounds/percussion/shaker01.wav'
import tom01 from './sounds/percussion/conga01.wav'
import tom02 from './sounds/percussion/conga02.wav'
import tom03 from './sounds/percussion/conga03.wav'
import sound from './sounds/hihats/ride01.wav'

export const Sounds = {
    kick: new Audio(kickDrum),
    snare: new Audio(snareDrum),
    clap: new Audio(clap),
    hihat: new Audio(openHigh),
    tom01: new Audio(tom01),
    tom02: new Audio(tom02),
    tom03: new Audio(tom03),
    sound: new Audio(sound)
}
import React from 'react'

import kick from './sounds/kicks/kick01.wav'



class Conductor {
    constructor() {

        this.tempo = AppContext.tempo
        this.ticker = 'tick'

        this.timer = setInterval(function(ticker) {
            console.log(this.ticker)
            this.ticker = this.ticker === 'tick' ? 'tock' : 'tick'
        }, 1000)
        
        console.log(`created conductor with tempo ${this.tempo}`)
    }
}



function fillGridWithDefault(grid) {
    let armedMatrix = new Array(8)

    for (let i = 0; i < 8; i++) {
        armedMatrix[i] = new Array(8)
        
        for (let j = 0; j < 8; j++) {
            armedMatrix[i][j] = new SoundObject(kick, 'dead')
        }
    }

    return armedMatrix
}

const startPlaying = () => {
    AppContext.conductor = new Conductor(AppContext.tempo)
}

const stopPlaying = () => {
    AppContext.playing = false
    delete AppContext.conductor
    AppContext.conductor = undefined

    console.log('deleted the conductor')
}

const AppContext = React.createContext({
    playing: false,
    conductor: null,
    grids: fillGridWithDefault([new Array(8), new Array(8)]),
    tempo: 1200,
    start: startPlaying.bind(this),
    stop: stopPlaying.bind(this),
    sounds: {
        kick: new Audio(kick),
        snare: new Audio(snare)
    }
})



export default AppContext
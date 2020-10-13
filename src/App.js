import React from 'react';
import * as Tone from 'tone'

import ControlBar from './components/ControlBar'
import Grid from './components/Grid'
import Selector from './components/Selector'
import Synth from './components/Synth'

import {Sounds} from './Sounds.js'

import styles from './App.module.css';

class SoundObject {
  constructor(file, locationInGrid, status, activateTile) {
      this.file = file
      this.locationInGrid = locationInGrid
      this.active = status //did the user click the tile / will it be played?
      this.handleClick = () => activateTile('Drums', locationInGrid)
      this.play = () => {
        this.file.currentTime = 0 
        this.file.play()
      }
  }
}

class SynthObject {
  constructor(location, activateTile, synth, tone) {
    this.active = false
    this.locationInGrid = location
    this.play = () => synth.triggerAttackRelease(tone, "32n")
    this.handleClick = () => activateTile('Synth', location)
    this.tone = tone
  }
}

const keyCodes = {
  'a': 0,
  's': 1,
  'd': 2,
  'f': 3,
  'g': 4,
  'h': 5,
  'j': 6,
  'k': 7,
  'l': 8
}

const synth = new Tone.PolySynth().toDestination()

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      currentStep: 0,
      currentMilliSeconds: 0,
      gridsDrums: [this.createDrumGrid()],
      gridsSynth: [this.createSynthGrid()],
      gridsSelected: [this.createGridSelected(Object.keys(Sounds).length)],
      synth: synth,
      tempo: 125, 
      playing: false,
      loop: this.loop
    }

    this.activateTile.bind(this)
    this.changeTempo.bind(this)
    this.createSynthGrid.bind(this)
    this.startButtonClick.bind(this)
    this.loop.bind(this)
    this.stopButtonClick.bind(this)
    this.setNextStep.bind(this)

    document.addEventListener('keypress', this.setKeyEvents)
  }

  activateTile = (grid, location) => {
    let newGrid = [...this.state[`grids${grid}`]]
    let x = location[0]
    let y = location[1]

    newGrid[0][x][y].active = !newGrid[0][x][y].active

    this.setState({[`grids${grid}`]: newGrid})
  }

  addStepToRow = () => {
    alert('row will be longer')
  }

  changeTempo = newTempo => {
    this.setState({tempo: newTempo})  
  }

  createDrumGrid = () => {
    let newGrid = []

    Object.keys(Sounds).reverse().forEach((sound, i) => {
      newGrid[i] =  new Array(8).fill().map((tile, index) => {
        Sounds[sound].preload = true

        return new SoundObject(Sounds[sound], [i, index] , false, this.activateTile)
      })
    })

    return newGrid
  }

  createGridSelected = len => {
    let newGrid = [] 
    
    for (let index = 0; index < len; index++) {
      newGrid[index] = new Array(8).fill(false)
    }

    return newGrid
  }

  createSynthGrid = () => {
    let newGrid = []
    let tones = ['c', 'd', 'e', 'f', 'g', 'a', 'b', 'c']
    
    for(let i = 0; i < 8; i++) {
      newGrid[i] = []

      for(let j = 0; j < 8; j++) {
        let location = [i, j]

        newGrid[i][j] = new SynthObject(location, this.activateTile, synth, tones[i] + '3')
      }
    }

    return newGrid
  }

  loop = () => {
    if(this.state.playing) {
      clearTimeout(this.state.timer)
              
      this.setNextStep()

      this.setState({
        timer: setTimeout(this.state.loop, 60 / this.state.tempo * 1000 / 4),
        currentMilliSeconds: this.state.currentMilliSeconds + 1
      })
      

    }
  }

  setKeyEvents = e => {
    if (e.code === 'Space') {
      e.preventDefault()

      if (!this.state.playing) {
        this.startButtonClick()
      } else {
        this.stopButtonClick()
      }
    } else if(keyCodes.hasOwnProperty(e.key)) {
      let tones = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C']

      e.preventDefault()
      
      this.state.gridsDrums[0][0][0].play()
    }
  }

  //grid as a parameter means a string containing the name of the state prop that's being altered
  setNextStep = () => {
    let newGrid = this.state.gridsSelected[0]

    newGrid = newGrid.map((row, rowIndex) => {
      if (this.state.gridsDrums[0][rowIndex][this.state.currentStep].active) {
        this.state.gridsDrums[0][rowIndex][this.state.currentStep].play()
      }

      if (this.state.gridsSynth[0][rowIndex][this.state.currentStep].active) {
        this.state.gridsSynth[0][rowIndex][this.state.currentStep].play()
      }



      row[this.state.currentStep] =  true

      if (this.state.currentStep !== 0) {
        row[this.state.currentStep - 1] = false
      } else row[row.length - 1] = false

      return row
    })

    newGrid = [[...newGrid]]

    this.setState({
      gridsSelected: newGrid,
      currentStep: this.state.currentStep >= 7 ? 0 : this.state.currentStep + 1
    })
  }

  startButtonClick = async () => { 
    console.log('clicked start button')
    await this.setState({playing: !this.state.playing})
    if (this.state.playing) this.loop()
  }

  stopButtonClick = () => {
    if (this.state.playing) {
      let newGrid = [...this.state.gridsSelected[0]]

      for (let i = 0; i < newGrid.length; i++) {
        for (let j = 0; j < newGrid[i].length; j++) {
          newGrid[i][j] = false
        }
      }

      newGrid = [[...newGrid]]

      this.setState({
        gridsSelected: newGrid,
        currentStep: 0,
        playing: false,
        timer: null
    })
    }
  }

  render() {
    return ( 
      <div className={styles.App}>
          <ControlBar
            changeTempo={this.changeTempo}
            startButtonClick={this.startButtonClick}
            stopButtonClick={this.stopButtonClick}
            tempo={this.state.tempo}
          >
          </ControlBar>

          <Grid
            name={'DRUMS'}
            grid = {this.state.gridsDrums[0]}
            gridSelected = {this.state.gridsSelected[0]}
            addStepToRow={this.addStepToRow}
          >
          </Grid>

          <Grid
            name={'SYNTH'}
            grid = {this.state.gridsSynth[0]}
            gridSelected = {this.state.gridsSelected[0]}
            addStepToRow={this.addStepToRow}
          >
          </Grid>

          <Selector></Selector>

          <Synth></Synth>
      </div>
    )
  }
}

export default App;

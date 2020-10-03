import React from 'react';
import * as Tone from 'tone'

import ControlBar from './components/ControlBar'
import Grid from './components/Grid'
import Selector from './components/Selector'
import Synth from './components/Synth'

import {Sounds} from './Sounds.js'

import './App.css';

class SoundObject {
  constructor(file, locationInGrid, status, activateDrumTile) {
      this.file = file
      this.locationInGrid = locationInGrid
      this.active = status //did the user click the tile / will it be played?
      this.handleClick = () => activateDrumTile(locationInGrid)
      this.play = () => {
        this.file.currentTime = 0 
        this.file.play()
      }
  }
}


class App extends React.Component {
  constructor() {
    super()

    this.state = {
      currentTimer: 0,
      gridsDrums: [this.createDrumGrid()],
      gridsSelectedDrums: [this.createGridSelected(Object.keys(Sounds).length)],
      gridsSynth: [this.createSynthGrid()],
      gridsSelectedSynths: [this.createGridSelected(8)],
      tempo: 120, 
      playing: false,
      loop: this.loop
    }

    this.activateDrumTile.bind(this)
    this.activateSynthTile.bind(this)
    this.changeTempo.bind(this)
    this.startButtonClick.bind(this)
    this.loop.bind(this)
    this.stopButtonClick.bind(this)
    this.setNextStep.bind(this)

    document.addEventListener('keydown', this.setKeyEvents)
  }

  activateDrumTile = location => {
    let newGrid = [...this.state.gridsDrums]
    let x = location[0]
    let y = location[1]

    newGrid[0][x][y].active = !newGrid[0][x][y].active

    this.setState({gridsDrums: newGrid})
  }

  activateSynthTile = location => {
    let newGrid = [...this.state.gridsSynth]
    let x = location[0]
    let y = location[1]

    newGrid[0][x][y].active = !newGrid[0][x][y].active

    this.setState({gridsSynth: newGrid})
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
        return new SoundObject(Sounds[sound], [i, index] , false, this.activateDrumTile)
      })
    })

    return newGrid
  }

  createGridSelected = len => {
    let newGrid = [] 
    
    for (let index = 0; index < len; index++) {
      newGrid[index] = new Array(8).fill(false)
    }

    console.log('created selected grid of length: ' + newGrid.length)
    return newGrid
  }

  createSynthGrid = () => {
    let newGrid = []
    let tones = ['c', 'd', 'e', 'f', 'g', 'a', 'b', 'c']
    
    for(let i = 0; i < 8; i++) {
      newGrid[i] = new Array(8).fill().map((tile, index) => {
        let location = [i, index]

        return {
          active: false,
          locationInGrid: location, 
          handleClick: () => this.activateSynthTile(location),
          tone: tones[i] + '3'
        }
      })
    }

    return newGrid
  }

  loop = () => {
    if(this.state.playing) {
      this.setState({timer: setTimeout(this.state.loop, 60 / this.state.tempo * 1000 / 4)})
      this.setNextStep()
    }
  }

  setKeyEvents = e => {
    if (e.code === 'Space') {
      e.preventDefault()
      if (!this.state.playing) {
        this.startButtonClick()
      } else this.stopButtonClick()
    } else if(e.code === 'KeyA') {
      e.preventDefault()
        const synth = new Tone.Synth().toDestination();

        synth.triggerAttackRelease("C3", "8n");
    }
  }

  setNextStep = () => {
    let newGrid = this.state.gridsSelectedDrums[0]

    newGrid = newGrid.map((row, rowIndex) => {
      if (this.state.gridsDrums[0][rowIndex][this.state.currentTimer].active) {
        this.state.gridsDrums[0][rowIndex][this.state.currentTimer].play()
      }
      row[this.state.currentTimer] =  true

      if (this.state.currentTimer !== 0) {
        row[this.state.currentTimer - 1] = false
      } else row[row.length - 1] = false

      return row
    })

    newGrid = [[...newGrid]]

    this.setState({
      gridsSelectedDrums: newGrid,
      currentTimer: this.state.currentTimer >= 7 ? 0 : this.state.currentTimer + 1
    })
  }

  startButtonClick = async () => { 
    await this.setState({playing: !this.state.playing})
    if (this.state.playing) this.loop()
  }

  stopButtonClick = () => {
    if (this.state.playing) {
      let newGrid = [...this.state.gridsSelectedDrums[0]]

      for (let i = 0; i < newGrid.length; i++) {
        for (let j = 0; j < newGrid[i].length; j++) {
          newGrid[i][j] = false
        }
      }

      newGrid = [[...newGrid]]

      this.setState({
        gridsDrumsSelected: newGrid,
        currentTimer: 0,
        playing: false,
        timer: null
    })
    }
  }

  render() {
    return ( 
      <div className="App">
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
            gridSelected = {this.state.gridsSelectedDrums[0]}
            addStepToRow={this.addStepToRow}
          >
          </Grid>

          <Grid
            name={'SYNTH'}
            grid = {this.state.gridsSynth[0]}
            gridSelected = {this.state.gridsSelectedSynths[0]}
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

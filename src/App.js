import React from 'react';
import * as Tone from 'tone'

import ControlBar from './components/ControlBar'
import Grid from './components/Grid'
import Selector from './components/Selector'
import Synth from './components/Synth'

import {Sounds} from './Sounds.js'

import './App.css';

class SoundObject {
  constructor(file, locationInGrid, status, activateTile) {
      this.file = file
      this.locationInGrid = locationInGrid
      this.active = status //did the user click the tile / will it be played?
      this.selected = false //is this in current time being played?
      this.handleClick = () => activateTile(locationInGrid)
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
      grids: [this.createGrid()],
      gridsSelected: [this.createGridSelected()],
      tempo: 120, 
      playing: false,
      loop: this.loop
    }

    this.activateTile.bind(this)
    this.changeTempo.bind(this)
    this.startButtonClick.bind(this)
    this.loop.bind(this)
    this.stopButtonClick.bind(this)
    this.setNextStep.bind(this)

    document.addEventListener('keydown', this.setKeyEvents)
  }

  activateTile = location => {
    let newGrid = [...this.state.grids]
    let x = location[0]
    let y = location[1]

    newGrid[0][x][y].active = !newGrid[0][x][y].active

    this.setState({grids: newGrid})
  }

  addStepToRow = () => {
    alert('row will be longer')
  }

  changeTempo = newTempo => {
    this.setState({tempo: newTempo})  
  }

  createGrid = () => {
    let newGrid = []

    Object.keys(Sounds).reverse().forEach((sound, i) => {
      newGrid[i] =  new Array(16).fill().map((tile, index) => {
        Sounds[sound].preload = true
        return new SoundObject(Sounds[sound].cloneNode(), [i, index] , false, this.activateTile)
      })
    })

    return newGrid
  }

  createGridSelected = () => {
    let newGrid = [new Array(8).fill(false), new Array(8).fill(false)]

    this.setState({gridsSelected: [[newGrid]]})
  }

  loop = loop => {
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
      //create a synth and connect it to the main output (your speakers)
        const synth = new Tone.Synth().toDestination();

        //play a middle 'C' for the duration of an 8th note
        synth.triggerAttackRelease("C2", "4n");
    }
  }

  setNextStep = () => {
    let newGrid = this.state.grids[0]

    newGrid = newGrid.map((row, rowIndex) => {
      if (row[this.state.currentTimer].active) row[this.state.currentTimer].play()
      row[this.state.currentTimer].selected =  true

      if (this.state.currentTimer !== 0) {
        row[this.state.currentTimer - 1].selected = false
      } else row[row.length - 1].selected = false

      return row
    })

    newGrid = [[...newGrid]]

    this.setState({
      grids: newGrid,
      currentTimer: this.state.currentTimer >= 15 ? 0 : this.state.currentTimer + 1
    })
  }

  startButtonClick = async () => { 
    await this.setState({playing: !this.state.playing})
    if (this.state.playing) this.loop()
  }

  stopButtonClick = () => {
    console.log('stop button triggered')

    if (this.state.playing) {
      let newGrid = [...this.state.grids[0]]

      for (let i = 0; i < newGrid.length; i++) {
        for (let j = 0; j < newGrid[i].lenght; i++) {
          console.log(newGrid[i][j].selected)
          newGrid[i][j].selected = false
        }
      }

      newGrid = [[...newGrid]]

      this.setState({
        grids: newGrid,
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
            grid = {this.state.grids[0]}
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

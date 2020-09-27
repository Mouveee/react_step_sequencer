import React from 'react';

import ControlBar from './components/ControlBar'
import Grid from './components/Grid'

import {Sounds} from './Sounds.js'

import './App.css';


class SoundObject {
  constructor(file, locationInGrid, status, activateTile) {
      this.file = file
      this.locationInGrid = locationInGrid
      this.active = status //did the user click the tile / will it be played?
      this.selected = false
      this.handleClick = () => activateTile(locationInGrid)
      this.play = () => {
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
      tempo: 120, 
      playing: false,
      loop: this.loop
    }

    this.activateTile.bind(this)
    this.startButtonClick.bind(this)
    this.loop.bind(this)
    this.stopButtonClick.bind(this)
    this.setNextStep.bind(this)

    document.addEventListener('keydown', e => {
      if (e.code === 'Space') {
        e.preventDefault()
        if (!this.state.playing) {
          this.startButtonClick()
        } else this.stopButtonClick()
      }
    })
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

    for (let i = 0; i < 2; i++) {
      newGrid[i] =  new Array(8).fill().map((tile, index) => {
        return new SoundObject(i === 0 ? Sounds.kick : Sounds.snare, [i, index] , false, this.activateTile)
      })
    }

    return newGrid
  }

  loop = loop => {
    if(this.state.playing) {
      this.setState({timer: setTimeout(this.state.loop, this.state.tempo / 60 * 1000 / 4)})
      this.setNextStep()
    }
  }

  setNextStep = () => {
    let newGrid = this.state.grids[0]


    newGrid = newGrid.map((row, rowIndex) => {
      console.log(`length of row: ${row.length}`)
      if (row[this.state.currentTimer].active) row[this.state.currentTimer].play()
      row[this.state.currentTimer].selected =  true

      if (this.state.currentTimer !== 0) {
        row[this.state.currentTimer - 1].selected = false
      } else row[row.length - 1].selected = false

      return row
    })

    console.log(newGrid)
    newGrid = [[...newGrid]]

    this.setState({
      grids: newGrid,
      currentTimer: this.state.currentTimer >= 7 ? 0 : this.state.currentTimer + 1
    })
  }

  startButtonClick = async () => { 
    await this.setState({playing: !this.state.playing})
    if (this.state.playing) this.loop()
  }

  stopButtonClick = () => {
    if (this.state.playing) {
      clearTimeout(this.state.timer)

      this.setState({
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
            startButtonClick={this.startButtonClick}
            stopButtonClick={this.stopButtonClick}
          >
          </ControlBar>

          <Grid
            grid = {this.state.grids[0]}
            addStepToRow={this.addStepToRow}
          >
          </Grid>
      </div>
    )
  }
}

export default App;

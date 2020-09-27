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
      this.selected = 
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
      currentTimer: null,
      grids: [this.createGrid()],
      tempo: 120, 
      playing: false,
      loop: this.loop
    }

    this.activateTile.bind(this)
    this.startButtonClick.bind(this)
    this.loop.bind(this)
    this.stopButtonClick.bind(this)

    document.addEventListener('keydown', e => {
      console.log(e.code)
    
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

  changeTempo = newTempo => {
    this.setState({tempo: newTempo})
  }


  createGrid = () => {
    let newGrid = []

    for (let i = 0; i < 8; i++) {
      newGrid[i] =  new Array(8).fill().map((tile, index) => {
        return new SoundObject(Sounds.kick, [i, index] , false, this.activateTile)
      })
    }

    return newGrid
  }

  setSelectedStep = (row,index) => {

  }

  loop = loop => {
      if(this.state.playing) {
        console.log('tick')
        this.state.grids[0][0][0].play()
        this.setState({timer: setTimeout(this.state.loop, this.state.tempo / 60 * 1000 / 4)})
      }
    }

  startButtonClick = async () => { 
    await this.setState({playing: !this.state.playing})
    if (this.state.playing) this.loop()
  }

  stopButtonClick = () => {
    if (this.state.playing) {
      clearTimeout(this.state.timer)

     this.setState({
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
          >
          </Grid>
      </div>
    )
  }
}

export default App;

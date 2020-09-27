import * as React from 'react'

import styles from './Tile.module.css'

class Tile extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            tile: this.props.tile
        }
    }

    render() {
        return (
            <div 
                className={`${styles.BA_tile} ${this.state.tile.active ? styles.active : ''}`} 
                onClick={this.state.tile.handleClick}
            >    
            </div>
        )
    }
}

export default Tile

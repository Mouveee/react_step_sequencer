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
                className={`
                    ${styles.BA_tile} 

                    ${this.state.tile.active ? 
                        styles.active : 
                        ''
                    } 

                    ${this.state.tile.selected ? 
                        styles.selected : 
                        ''
                    }

                    ${(this.state.tile.locationInGrid[1] + 1) % 4 === 1 ? 
                        styles.fourth: 
                        ''
                    }
                    
                    `} 
                onClick={this.state.tile.handleClick}
            >    
            </div>
        )
    }
}

export default Tile

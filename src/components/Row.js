import * as React from 'react'

import Tile from './Tile.js'

import styles from './Row.module.css'

export default class Row extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            currentTile: 0,
            sound: null,
            muted: false,
            tiles: [...this.props.row]
        }
    }

    render() {
        let rowKey = this.props.rowKey

        return (
            <div 
                key={rowKey} 
                className={styles.BA_row}
            >
                {this.state.tiles.map((tile, index) => {
                        return (
                            <Tile
                                key={'tile-' + index}
                                tile={tile}
                            >
                            </Tile>
                        )
                })}
            </div>
        )
    }
}
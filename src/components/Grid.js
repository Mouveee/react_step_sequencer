import * as React from 'react'

import styles from './Grid.module.css'

import Row from './Row.js'


class Grid extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            grid: this.props.grid,
            tempo: this.props.tempo
        }
    }


    render() {
        return(
            <div className={styles.BA_grid} key="BA_grid">  
                {this.props.name}
                {
                    this.state.grid.map((row, index) => {
                        const key = index.toString()
                        
                        return (
                            <Row 
                                addStep={this.props.addStepToRow}
                                rowSelected={this.props.gridSelected[index]}
                                row={row}  
                                key={'row-' + key}
                                rowKey={this.props.rowKey}
                            >
                            </Row>
                        )
                    })
                }
            </div>
        )
    }
}

export default Grid

import * as React from 'react'

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
            <div id="BA_grid" key="BA_grid">               
                {
                    this.state.grid.map((row, index) => {
                        const key = index.toString()
                        
                        return (
                            <Row 
                                addStep={this.props.addStepToRow}
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

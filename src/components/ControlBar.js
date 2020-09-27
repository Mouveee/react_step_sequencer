import * as React from 'react'

import styles from './ControlBar.module.css'

import Grid from '@material-ui/core/Grid'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'
import Slider from '@material-ui/core/Slider'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
    root: {
      width: 200,
    },
  })

export default function(props) {
    return (
        <Grid container spacing={1} className={styles.controlBar}>
            <Grid item xs>
                <PlayArrowIcon 
                    className={styles.controlIcon}
                    onClick={props.startButtonClick}
                >
                </PlayArrowIcon>
            </Grid>
            
            <Grid item xs>
                <StopIcon
                    className={styles.controlIcon}
                    onClick={props.stopButtonClick}
                >
                </StopIcon>
            </Grid>

            <Grid item xs>
                <Slider>
                </Slider>
            </Grid>
        </Grid>
    )
}
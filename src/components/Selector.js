import * as React from 'react'

import styles from './Selector.module.css'

export default function Selector(props) {
    return( 
        <nav>
            <ul className={styles.selectorMenu}>
                <li className={styles.selectorMenuItem}>Drum Sequencer</li>
                <li className={styles.selectorMenuItem}>Synth Sequencer</li>
                <li className={styles.selectorMenuItem}>About</li>
            </ul>
        </nav>
    )
}
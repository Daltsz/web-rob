import './common/common.css'
import './css/style.css'
import React, {useEffect} from 'react'
import useBlocklyGamesLoader from './boot.js';
// import boot from './boot.js'

function IndexBlocklyGames(){
    useBlocklyGamesLoader()

    return (
        <div>
            <noscript>Blockly Games requires JavaScript.</noscript>
        </div>
    )
}


export default IndexBlocklyGames
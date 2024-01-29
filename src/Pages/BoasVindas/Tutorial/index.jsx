import React from 'react';
import "../Tutorial/index.css"; // Importe seu arquivo CSS aqui

function Tutorial() {
    const videoId = 'https://www.youtube.com/watch?v=LK7M2ftEfrg'; // Substitua pelo ID do vídeo do YouTube

    return (
        <div className="fundo-tutorial">
            <div id='tutorial'>
                <h1 className="h1Tutorial-tutorial">Tutorial</h1>

                <div className="video">
                    {/* <iframe width="1000" height="574" src="https://www.youtube.com/embed/LK7M2ftEfrg?si=bmnvbHxNybrxEqss" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}
                </div>
            </div>

        </div>
    );
}

export default Tutorial;

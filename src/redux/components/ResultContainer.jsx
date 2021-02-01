import React from 'react'

function ResultContainer() {
    return (
        <div id="cornerInfoContainer">
            <button onClick={() => setShow(prev => !prev)}>
                <img src={process.env.PUBLIC_URL + "/info.svg"}></img>
            </button>
            {show && <div className="infoContainer">
                <h3>{title}</h3>
                <p>{info}</p>
            </div>}
        </div>
    )
}

export default ResultContainer

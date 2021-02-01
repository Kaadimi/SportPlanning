import React, {useState} from 'react'

function InfoContainer({ title, info }) {
    const [show, setShow] = useState(true)

    return (
        <div id="cornerInfoContainer">
            <button onClick={() => setShow(prev => !prev)}>
                <img alt="infoIcon" src={process.env.PUBLIC_URL + "/info.svg"}></img>
            </button>
            {show && <div className="infoContainer">
                <h3>{title}</h3>
                <p>{info}</p>
            </div>}
        </div>
    )
}

export default InfoContainer

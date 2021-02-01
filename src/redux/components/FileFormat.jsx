import React from 'react'
import "../styles/Groups.css"

function FileFormat({ headers }) {
    return (
        <div id="fileFormat">
            {headers.map((header, i) => <span key={i}>{header}</span>)}
        </div>
    )
}

export default FileFormat

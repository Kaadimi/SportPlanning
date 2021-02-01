import React from 'react'

function ComponentOrder({order, status = false}) {
    return (
        <div className="orderContainer" id={status ? "choosenOrder" : null}>
            <span>{order}</span>
        </div>
    )
}

export default ComponentOrder
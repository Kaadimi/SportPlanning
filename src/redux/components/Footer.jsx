import React from 'react'
import '../styles/Planning.css'

function Footer() {
    return (
        <div id="footer">
            <a href="https://iliaskadimi.netlify.app/" target="_blank" rel="noopener noreferrer" className="linkButtons">
                <img alt="myWebsite" src={process.env.PUBLIC_URL + "/person.svg"}></img>
            </a>
        </div>
    )
}

export default Footer

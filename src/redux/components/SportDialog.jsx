import React, {useState, useRef, useEffect} from 'react'
import { useInput } from "../hooks/useInput"
import "../styles/Dialogs.css"
import { useTranslation } from 'react-i18next'

function SportDialog({ setDialog, addSport, sport }) {
    const { t } = useTranslation();
    const [name, setSport] = useState(sport.name)
    const [color, setColor] = useState(sport.color)
    const [suggestions, setSuggestions] = useState(false)
    const [edit, setEdit] = useState(true)
    const {value: sessions, bind:bindSportSessions} = useInput(sport.sessions)
    const {value: min, bind:bindSportMin} = useInput(sport.min)
    const {value: max, bind:bindSportMax} = useInput(sport.max)
    const {value: offset, bind: bindGroupOffset} = useInput(sport.offset)
    const suggestionsWrapper = useRef(null)
    const sportOptions = ["basketball", "football", "swimming", "handball", "volleyball"]

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        if (sport.name === "")
            setEdit(false)
        return (() => {
            document.removeEventListener('mousedown', handleClickOutside)
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleClickOutside = event => {
        const {current: wrap} = suggestionsWrapper

        if (wrap && !wrap.contains(event.target)) {
            setSuggestions(false)
        }
    }

    return (
        <div className="dialogBackground">
            <div id="sportDialogContainer">
                <div id="sportDialogHeader">
                    <span id="sportDialogTitle">{t('sport')}</span>
                    <button id="closeSportBtn" onClick={(e) => {e.preventDefault();setDialog(null)}}>
                        <img alt="closeIcon" src={process.env.PUBLIC_URL + "close.svg"}></img>
                    </button>
                </div>
                <div id="sportDialogContent">
                    <div className="sportInputDiv">
                        <span className="subtitle">{t('name')}</span>
                        <input type="text" value={name} onClick={() => setSuggestions(true)} onChange={(e) => setSport(e.target.value)} className="sportsInput" />
                        {suggestions && <div ref={suggestionsWrapper} id="sportsMenu">
                            {sportOptions.map((option, i) => {
                                if (option.toLowerCase().indexOf(name.toLowerCase()) >= 0)
                                    return <p tabIndex="0" onClick={() => {setSport(option); setSuggestions(false)}} id="sportsOption" key={i}>{option}</p>
                                else
                                    return null
                            })}
                        </div>}
                    </div>
                    <div className="sportInputDiv">
                        <span className="subtitle">{t('sessions')}</span>
                        <input {...bindSportSessions}  type="number" min="1"></input>
                    </div>
                    <div className="sportInputDiv">
                        <span className="subtitle">{t('min')}</span>
                        <input {...bindSportMin}  type="number" min="1" ></input>
                    </div>
                    <div className="sportInputDiv">
                        <span className="subtitle">{t('max')}</span>
                        <input {...bindSportMax}  type="number" min="2" ></input>
                    </div>
                    <div className="sportInputDiv">
                        <span className="subtitle">{t('offset')}</span>
                        <input {...bindGroupOffset}  type="number" min="0"></input>
                    
                    </div>
                    <div className="sportInputDiv">
                        <span className="subtitle">{t('color')}</span>
                        <input  value={color} onChange={e => setColor(e.target.value)} className="sportsInput" type="color" min="0"></input>
                    </div>
                </div>
                <div className="addSportActions">
                    <button id="AddSportBtn" onClick={e => {e.preventDefault(); addSport({sport: {name, sessions, min, max, offset, color}, edit})}}>
                        <span>{edit ? t('edit') : t('create')}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SportDialog
//addSport({name, max, min, sportSessions, offset, color})
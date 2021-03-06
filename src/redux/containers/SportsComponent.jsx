import React, { useState } from 'react'
import { setError } from '../actions/Dialogs'
import { useDispatch } from 'react-redux'
import ComponentOrder from "../components/ComponentOder"
import SportDialog from "../components/SportDialog"
import "../styles/Sports.css"
import { useTranslation } from 'react-i18next'

function SportsComponent({sports, labels, setLSports}) {
    const { t } = useTranslation();
    const newSport = {name: "", color: "#ffffff", sessions: 1, min: 20, max: 30, offset: 5}
    const icons = ["basketball", "football", "swimming", "handball", "volleyball"] 
    const [dialog, setDialog] = useState(null)
    const dispatch = useDispatch()

    const deleteSport = (name) => {
        setLSports(prev => {
            const ret = prev.filter(value => value.name !== name)
            localStorage.setItem('sports', JSON.stringify(ret))
            return ret;
        })
    }

    const addSport = ({sport, edit}) => {
        if (sport)
        {
            const {name, min, max, offset, sessions, color} = sport
            let id2 = labels.indexOf(name.toLowerCase())
            
            if (!edit && id2 >= 0)
                dispatch(setError('sportExists'))
            else if (min >= max)
                dispatch(setError('minMax'))
            else if (name && min && max && sessions && color && offset >= 0)
            {
                if (edit)
                {
                    setLSports(prev => {
                        const ret = prev.map(value => {
                            if (value.name === name)
                                return sport
                            else
                                return value
                        })
                        localStorage.setItem('sports', JSON.stringify(ret))
                        return ret; 
                    })
                }
                else
                {
                    setLSports(prev => {
                        const ret = [...prev, {name, sessions, min, max, offset, color}] 
                        localStorage.setItem('sports', JSON.stringify(ret))
                        return ret;
                        
                    })
                }
                setDialog(null)
            }
            else
                dispatch(setError('formNotComplete'))
        }
        else
            dispatch(setError('formNotComplete'))
    }

    const sportIcon = icon => {
        if (icons.indexOf(icon) >= 0)
            return `/${icon}.svg`
        else
            return '/other.svg'
    }

    return (
        <div id="sportsContainer">
            <div id="sportContainerTitle" className="sportContainer">
                <h3>SPORTS</h3>
            </div>
            <ComponentOrder order={1} status={sports.length === 0 ? true : false}/>
            {sports && [...sports.values()].map((sport, i) => {
                return (
                    <div key={i} className="sportContainer" style={{background: sport.color}}>
                        <div className="sportinnerContainer">
                            <div className="sportInnderLeftContainer">
                                <p>{sport.name}</p>
                                <img alt="sportIcon" src={process.env.PUBLIC_URL + sportIcon(sport.name)}></img>
                            </div>

                            <div className="sportInnderMiddleContainer">
                                <p>{t('sessions')} : <span className="sportValues">{sport.sessions}</span></p>
                                <p>{t('min')} : <span className="sportValues">{sport.min}</span></p>
                                <p>{t('max')} : <span className="sportValues">{sport.max}</span></p>
                                <p>{t('offset')} : <span className="sportValues">{sport.offset}</span></p>
                            </div>

                            <div className="sportContainerActions">
                                <button>
                                    <img alt="deleteSport" onClick={() => deleteSport(sport.name)} src={process.env.PUBLIC_URL + "/close.svg"}></img>
                                </button>
                                <button onClick={() => setDialog(sport)}>
                                    <img alt="editSport" src={process.env.PUBLIC_URL + "/edit.svg"}></img> 
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })}
            <button onClick={() => setDialog(newSport)} id="addNewSport">
                <img alt="addSport" src={process.env.PUBLIC_URL + "/add.svg"}></img> 
            </button>
            {dialog ? <SportDialog setDialog={setDialog} addSport={addSport} sport={dialog}/> : null}
        </div>
    )
}

export default SportsComponent

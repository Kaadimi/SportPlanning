import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { findSportSessions } from '../actions/planning'
import SportSession from "../components/SportSession"
import "../styles/PlanningTable.css"
import { useTranslation } from 'react-i18next'
import { generatePlanning } from '../actions/planning'
import { setError } from '../actions/Dialogs'

function PlanningTable({ labels, setDialog, sports, groups }) {
    const { t } = useTranslation();
    const dispatch = useDispatch()
    const [clashDialog, setClashDialog] = useState(false)
    const {days, sessions, timeTable, cost, clashes, loading} = useSelector(state => state)
    const colWidth = {width: `${100/sessions | 0}%`}

    return (
        <div className="dialogBackground">
            <div className="planningTable">
                <div id="planningTableHeader">
                    <span id="sportDialogTitle">{t('planning')}</span>
                    <button id="closeSportBtn" onClick={(e) => {e.preventDefault();setDialog(false)}}>
                        <img alt="closeIcon" src={process.env.PUBLIC_URL + "close.svg"}></img>
                    </button>
                </div>
                <div id="planningTableResult">
                    <p id={cost > 0 ? "errorColor" : null}>{t('generatedErrors')} {cost}</p>
                    {cost > 0 && <div>
                        <div className="planningClashesActions">
                            {clashes.length > 0 && <button onClick={() => setClashDialog(prev => !prev)}>{t('clashes')}</button>}
                            {!loading && <button id="remakeButton" onClick={() => {groups ? dispatch(generatePlanning(groups, sports, days, sessions)) : dispatch(setError('noGroups'))}}>{t('remake')}</button>}
                        </div>
                        {clashDialog && <div id="clashesDiv">
                            {clashes.map((clash, i) => <div key={i} id="clashesBody">
                                <span>{t('day')}: {clash.day}</span>
                                <span>{`GROUP ${clash.group1} - GROUP ${clash.group2}`}</span>
                            </div>)}
                        </div>}
                    </div>}
                </div>
                <div id="planningHeader">
                    {[...Array(sessions)].map((e, i) => <div className="planningside" key={i} id="planningHeaderCol" style={colWidth}>{t('session')} {i + 1}</div>)}
                </div>
                <div id="planningDays">
                    {[...Array(days)].map((e, i) => <div className="planningside" key={i} id="planningHeaderRow">{t('day')} {i + 1}</div>)} 
                </div>
                <div id="planningBody">
                    {timeTable.map((day, i) => {
                        return (
                            <div id="planningRow" key={i}>
                                {day.map((ses, j) => {
                                    return (
                                        <div id="planningCol" style={colWidth} key={"session" + i + j}>
                                            {labels.map((activity, h) => {
                                                    return <SportSession key={"session" + i + j + h} activity={activity} location={findSportSessions(h, ses)} ses={ses} sports={sports} groups={groups}/>})
                                            }
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default PlanningTable

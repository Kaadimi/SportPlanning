import React, {useState} from 'react'
import InfoContainer from "../components/InfoContainer"
import ComponentOrder from "../components/ComponentOder"
import PlanningTable from "./PlanningTable"
import { useInput } from '../hooks/useInput'
import { useDispatch, useSelector } from 'react-redux'
import "../styles/Groups.css"
import { generatePlanning } from '../actions/planning'
import { setError } from '../actions/Dialogs'
import { useTranslation } from 'react-i18next'

function PlanningContainer() {
    const { t } = useTranslation();
    const dispatch = useDispatch()
    const [dialog, setDialog] = useState(false)
    const {value: days, bind: bindDays} = useInput(5)
    const {value: sessions, bind: bindSessions} = useInput(3)
    const { groups, timeTable, sports } = useSelector(state => state)
    const labels = [...sports.values()].map(sport => sport.name)

    return (
        <div className="middleContainers">
            <h2>{t('planning')}</h2>
            <ComponentOrder order={3} status={groups && !timeTable ? true : false}/>
            <div className="planningInputContainer">
                <div id="inputDiv">
                    <div className="planningInputs">
                        <span>{t('days')}</span>
                        <input {...bindDays} type="number"></input>
                    </div>
                    <div className="planningInputs">
                        <span>{t('sessions')}</span>
                        <input {...bindSessions} type="number"></input>
                    </div>
                </div>
                <div id="groupsActions">
                    <button id={groups ? "showGroups" : "disabledBtn"} onClick={() => {groups ? dispatch(generatePlanning(groups, sports, days, sessions)) : dispatch(setError('noGroups'))}}>{t('generatePlanning')}</button>
                    <button id={timeTable ? "showGraph" : "disabledBtn"} onClick={() => {timeTable ? setDialog(true) : dispatch(setError('noPlanning'))}}>{t('showPlanning')}</button>
                </div>
                <InfoContainer title={"INFO"} info={t('info')}/>
                {dialog && timeTable && <PlanningTable labels={labels} sports={sports} groups={groups} setDialog={setDialog}/>}
            </div>
        </div>
    )
}

export default PlanningContainer

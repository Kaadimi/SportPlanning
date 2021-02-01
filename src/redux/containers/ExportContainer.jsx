import React from 'react'
import FileFormat from "../components/FileFormat"
import ComponentOrder from "../components/ComponentOder"
import { downloadPlanning } from "../actions/ReadFile"
import { useSelector, useDispatch } from 'react-redux'
import "../styles/Groups.css"
import { setError } from '../actions/Dialogs'
import { useTranslation } from 'react-i18next'

function ExportContainer() {
    const { t } = useTranslation();
    const {timeTable, groups, students, sports} = useSelector(state => state)
    const labels = [...sports.values()].map(sport => sport.name)
    const dispatch = useDispatch()

    return (
        <div className="middleContainers">
            <h2>{t('exportTitle')}</h2>
            <ComponentOrder order={4} status={timeTable ? true : false}/>
            <FileFormat headers={["Name", "School", "Establishment", "Sport", "Day", "Session"]}/>
            <button id={timeTable ? "exportBtn" : "disabledExport"} onClick={() => {timeTable ? downloadPlanning(timeTable, groups, students, labels) : dispatch(setError(t('noPlanning')))}}>{t('exportPlanning')}</button>
        </div>
    )
}

export default ExportContainer

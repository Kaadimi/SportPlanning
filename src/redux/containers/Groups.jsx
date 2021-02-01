import React, {useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FileFormat from "../components/FileFormat"
import ComponentOrder from "../components/ComponentOder"
import GroupTables from "../components/GroupTables"
import Graph from "../components/Graph"
import Error from "../components/Error"
import LoadingDialog from "../components/LoadingDialog"
import { readExcel } from "../actions/ReadFile"
import "../styles/Groups.css"
import { setError } from '../actions/Dialogs'
import { useTranslation } from 'react-i18next'

function Groups({ Lsports }) {
    const { t } = useTranslation();
    const dispatch = useDispatch()
    const { file, students, groups, timeTable, sportsCount, groupSize, error, sports, loading } = useSelector(state => state)
    const labels = [...sports.values()].map(sport => sport.name)
    const colors = [...sports.values()].map(sport => sport.color + "BB") 
    const inputForm = useRef(null)
    const [dialog, setDialog] = useState(0)

    return (
        <div className="middleContainers">
            <h2>{t('importTitle')}</h2>
            <ComponentOrder order={2} status={!groups && Lsports.size > 0 ? true : false}/>
            <FileFormat headers={["Firstname", "Lastname", "School", "Establishment", "Sport1", "Sport2"]}/>
            <form ref={inputForm} className="file-drop-area">
                <span className="fake-btn">{t('chooseFile')}</span>
                <span className="file-msg">{file ? file : t('dragDrop') }</span>
                <input onChange={(e) => dispatch(readExcel(e.target.files[0], inputForm, Lsports, timeTable ? true : false))} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className="file-input" type="file"/>
            </form>
            <div id="groupsActions">
                <button id={groups ? "showGroups" : "disabledBtn"} onClick={() => {groups ? setDialog(1) : dispatch(setError(t('noGroups')))}}>{t('showGroups')}</button>
                <button id={groups ? "showGraph" : "disabledBtn"} onClick={() => {groups ? setDialog(2) : dispatch(setError(t('noGroups')))}}>{t('showGraph')}</button>
            </div>
            {groups && students && dialog === 1 && <GroupTables groups={groups} labels={labels} students={students} setDialog={setDialog}/>}
            {sports && dialog === 2 && <Graph sportsCount={sportsCount} groupSize={groupSize} labels={labels} colors={colors} setDialog={setDialog}/>}
            {loading && <LoadingDialog />}
            {error && <Error error={error}/>}
            {}
        </div>
    )
}

export default Groups

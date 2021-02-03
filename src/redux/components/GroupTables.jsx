import React from 'react'
import "../styles/Dialogs.css"
import { useTranslation } from 'react-i18next'

function GroupTables({groups, labels, students, setDialog}) {
    const { t } = useTranslation();

    return (
        <div className="dialogBackground">
            <div id="studentGroups">
                <div className="styled-table">
                <div id="sportDialogHeader">
                    <span id="sportDialogTitle">{t('sportGroups')}</span>
                    <button id="closeSportBtn" onClick={(e) => {e.preventDefault();setDialog(0)}}>
                        <img alt="closeIcon" src={process.env.PUBLIC_URL + "close.svg"}></img>
                    </button>
                </div>
                    {groups.map(group => {
                    return (<div className="groupsRow" key={group.id}>
                                <div id="groupsHeader">
                                    <p>{t('group')} {group.id}</p>
                                    <p>{labels[group.sport]}</p>
                                </div>
                                <p id="studentRow">{group.students.map((student, i) => <span id="studentName" key={i}>{students[student].name} </span>)} </p>
                                </div>)})
                    }
                </div>
            </div>
        </div>
    )
}

export default GroupTables
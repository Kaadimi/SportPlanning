import React, {useState} from 'react'
import { useTranslation } from 'react-i18next'

function SessionGroups({groups, students, ses, indexes, setDialog}) {
    const { t } = useTranslation();
    const [id, setId] = useState(indexes[0])

    return (
        <div className="dialogBackground">
            <div id="groupDialogContainer">
                <div id="sportDialogTop">
                    <div id="sportDialogHeader">
                        <span id="sportDialogTitle">{t('group')}</span>
                        <button id="closeSportBtn" onClick={(e) => {e.preventDefault();setDialog(null)}}>
                            <img alt="closeIcon" src={process.env.PUBLIC_URL + "close.svg"}></img>
                        </button>
                    </div>
                    <div id="groupDialogActions">
                        {indexes.map((index, i) => <button id={index === id ? "activeBtn" : null} onClick={() => setId(index)} key={i}>N{ses[index].group}</button>)}
                    </div>
                </div>
                <div id="studentDialogContainer">
                    {groups[id].students.map((student, i) => <span key={i}>{students[student].name} </span>)}
                </div>
            </div>
        </div>
    )
}

export default SessionGroups

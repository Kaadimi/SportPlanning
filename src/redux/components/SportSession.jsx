import React, {useState, useEffect} from 'react'
import { useTranslation } from 'react-i18next'
// import Group from "../components/Group"
import "../styles/PlanningTable.css"

function SportSession({activity, location, ses, sports, groups}) {
    const { t } = useTranslation();
    const [popup, setPopup] = useState(false)
    const [warning, setWarning] = useState(false)
    const icons = ["basketball", "football", "swimming", "handball", "volleyball"]

    const sportIcon = icon => {
        if (icons.indexOf(icon) >= 0)
            return `/${icon}.svg`
        else
            return '/other.svg'
    }

    useEffect(() => {
        const sportSessions = sports[location.sport].sessions

        if (!location.empty && location.indexes.length > sportSessions)
            setWarning(true)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="sportDiv" style={!location.empty ? {background: warning ? "#ff0000" : sports[location.sport].color} : null}>
            <div className="sportInsideDiv">
            <img alt="sessionIcon" src={warning ? `${process.env.PUBLIC_URL}/warning.svg` : `${process.env.PUBLIC_URL}${sportIcon(activity)}`}></img>
                <p className="planningSport"><span>{activity}</span></p>
                {!location.empty ? <button onClick={() => setPopup(prev => !prev)} className="planningGroup">
                    {location.indexes.length} 
                    <img alt="sessionIcon" src={`${process.env.PUBLIC_URL}/group.svg`}></img>
                </button> : null}
                {popup && <div id="groupsPopup">{location.indexes.map(index => <span key={index}>{t('group')} N{ses[index].group}</span>)}</div>}
                {/* group <span>{ses[index].group}</span> */}
                {/* {group >= 0 ? <Group studentsId={groups[ses[group].group].students} index={ses[group].group} sport={activity} setGroup={setGroup}/> : null} */}
            </div>
        </div>
    )
}

export default SportSession
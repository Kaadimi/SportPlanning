import React, {useState, useEffect} from 'react'
import SessionGroups from "../components/SessionGroups"
import "../styles/PlanningTable.css"

function SportSession({activity, location, ses, sports, groups, students}) {
    const [dialog, setDialog] = useState(false)
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
                {!location.empty ? <button onClick={() => setDialog(true)} className="planningGroup">
                    {location.indexes.length} 
                    <img alt="sessionIcon" src={`${process.env.PUBLIC_URL}/group.svg`}></img>
                </button> : null}
                {dialog && <SessionGroups groups={groups} students={students} ses={ses} indexes={location.indexes} setDialog={setDialog}/>}
            </div>
        </div>
    )
}

export default SportSession
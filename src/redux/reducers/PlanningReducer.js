import { SET_STUDENTS, SET_GROUPS, SET_ERROR, SET_TIME_TABLE, SET_SPORTS, SET_LOADING } from "../actions"

const initialState = {
    loading: false,
    students: null,
    file: "",
    groups: null,
    sportsCount: null,
    groupSize: null,
    days: 5,
    sessions: 3,
    sportOptions: ["Basketball", "Football", "Swimming", "Handball", "Volleyball"],
    sports: new Map(),
    timeTable: null,
    clashes: null,
    cost: 0,
    error: null,
    order: 1
}

const PlanningReducer = (state = initialState, {type, payload}) => {
    switch (type)
    {
        case SET_LOADING:
            return {
                ...state,
                loading: payload
            }
        case SET_ERROR:
            return {
                ...state,
                error: payload
            }
        case SET_SPORTS:
            return {
                ...state,
                sports: payload
            }
        case SET_STUDENTS:
            return {
                ...state,
                students: payload.students,
                sports: payload.sports,
                file: payload.file
            }
        case SET_GROUPS:
            return {
                ...state,
                groupSize: payload.groupSize,
                sportsCount: payload.sportsCount,
                groups: payload.groups,
            }
        case SET_TIME_TABLE:
            return {
                ...state,
                timeTable: payload.timeTable,
                clashes: payload.clashes,
                cost: payload.cost,
                days: payload.days,
                sessions: payload.sessions
            }
        default:
            return state
    }
}

export default PlanningReducer
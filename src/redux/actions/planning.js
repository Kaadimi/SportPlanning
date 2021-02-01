import { SET_STUDENTS, SET_TIME_TABLE, SET_GROUPS, SET_SPORTS, SET_LOADING } from "."

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max)
}

function first(classTable, schedule, schedule2, studentClash, groups, days, sessions, sports)
{
  let cost = 0
  let i = 0
  const t = groups.length
  const total_time = days * sessions
  while (i < t)
  {
    let time_tem = getRandomInt(total_time)
    let spaces_tem = groups[i].sport
    let class_tem = groups[i].class
    let classes_index = Math.floor((time_tem / sessions))

    classTable.set(i, [time_tem, spaces_tem, class_tem])
    schedule[time_tem][spaces_tem] += 1
    schedule2[classes_index].add(i)

    if (schedule[time_tem][spaces_tem] > sports[spaces_tem].sessions){
        cost++;
    }
    i++;
  }
  for (let i = 0; i < days; i++)
  {
    const day_clash = [...schedule2[i].values()]
    const len = day_clash.length
    for (let j = 0; j < len; j++)
    {
      for (let h = j + 1; h < len; h++)
      {
        if (studentClash[day_clash[j]].has(day_clash[h]))
        {
           cost++
        }
      }
    }
  }
  return cost;
}

function find_student_clashes(groups)
{
    return new Promise(resolve => {
        const promises = []

        const arr = groups.map(group => group.students)
        const arrLen = arr.length
        const clashes = new Array(arrLen)

        promises.push(new Promise(resolve => {
            for (let i = 0; i < arrLen; i++)
            {
                clashes[i] = new Set()
                const valueLen = arr[i].length
                for (let j = 0; j < valueLen; j++)
                {
                    for (let h = 0; h < arrLen; h++)
                    {
                        if (h !== i && arr[h].indexOf(arr[i][j]) > -1)
                            clashes[i].add(h)
                        resolve(true)
                    }
                }
            }
        }))
        Promise.all(promises).then(resolve(clashes))
    })
}

function daily_clashes(studentClash, index, schedule2, time)
{
//   const len = schedule2[time].size
  let cost = 0

  for (const value of schedule2[time])
  {
    if (value === index)
      continue;
    if (studentClash[index].has(value))
        cost++
  }
  return cost;
}

function dif_clashes(studentClash, rnd_group, schedule2, current_index, classes_index)
{
    const clashes = daily_clashes(studentClash, rnd_group, schedule2, current_index)
    const new_clashes = daily_clashes(studentClash, rnd_group, schedule2, classes_index)
    return clashes - new_clashes
}

function monte_carlo(classTable, schedule, schedule2, studentClash, len, days, sessions, sports, cost)
{
    let unincrease, iteration, max_iteration, dif_cost, total_time;

    iteration = 0;
    max_iteration = 1000000;
    unincrease = 0;
    total_time = days * sessions
    let max_unincrease = 1000;

  while (iteration < max_iteration)
  {
    let rnd_group = getRandomInt(len)
    let time_tem = getRandomInt(total_time)
    let classes_index = Math.floor((time_tem / sessions))

    let current_course = classTable.get(rnd_group)
    let current_time = current_course[0]
    let current_space = current_course[1]
    let current_class = current_course[2]
    let current_index = Math.floor((current_time / sessions))
    dif_cost = 0;

    if (current_time !== time_tem)
    {
        if (schedule[current_time][current_space] > sports[current_space].sessions)
        {
            if (schedule[time_tem][current_space] < sports[current_space].sessions)
                dif_cost++
        } else {
            if (schedule[time_tem][current_space] >= sports[current_space].sessions)
                dif_cost--
        }
        if (current_index !== classes_index)
            dif_cost += dif_clashes(studentClash, rnd_group, schedule2, current_index, classes_index)
    }

    if (dif_cost > 0)
    {
        schedule[current_time][current_space]--;
        schedule[time_tem][current_space]++;
        schedule2[current_index].delete(rnd_group)
        schedule2[classes_index].add(rnd_group)
        classTable.delete(rnd_group)
        classTable.set(rnd_group, [time_tem, current_space, current_class])
        cost = cost - dif_cost;
    }
    else {
      unincrease++;
    }
    if (unincrease === max_unincrease) break;
	if (cost === 0) break;
	iteration++;
  }
  return cost
}

const create_time_table = (classTable, days, sessions) => {
    const timeTable = new Array(days)
    for (let i = 0; i < days; i++)
    {
        timeTable[i] = new Array(sessions)
        for (let j = 0; j < sessions; j++)
            timeTable[i][j] = []
    }
    classTable.forEach((value, key) => {
        let day = Math.floor((value[0] / sessions))
        let session = Math.floor((value[0] % sessions))
        timeTable[day][session].push({sport: value[1], group: key})
    });
    return timeTable
}

const planning = (groups, sports, days, sessions) => {
    return new Promise((resolve, reject) => {
        let total_time = days * sessions
        let total_spaces = sports.length
      
        let cost = 0
        const classTable = new Map()
        const schedule = []
        const schedule2 = []
        const clashes = []
      
        for (let i = 0; i < total_time; i++)
        {
          if (i < days)
             schedule2.push(new Set())
          schedule.push(new Array(total_spaces).fill(0))
        }
        find_student_clashes(groups)
        .then(studentClash => {
            cost = first(classTable, schedule, schedule2, studentClash, groups, days, sessions, sports)
            cost = monte_carlo(classTable, schedule, schedule2, studentClash, groups.length, days, sessions, sports, cost)
            for (let i = 0; i < days; i++)
            {
              const day_clash = [...schedule2[i].values()]
              const len = day_clash.length
              for (let j = 0; j < len; j++)
              {
                for (let h = j + 1; h < len; h++)
                {
                  if (studentClash[day_clash[j]].has(day_clash[h]))
                    clashes.push({day: i + 1, group1: day_clash[j], group2: day_clash[h]})
                }
              }
            }
            resolve({cost, clashes, days, sessions, timeTable: create_time_table(classTable, days, sessions)});
        })
    })
}

export const generatePlanning = (groups, sports, days, sessions) => {
    return dispatch => {
        dispatch(setLoading(true))
        planning(groups, sports, days, sessions)
        .then(timeTable => {
            dispatch(setTimeTable(timeTable))
            dispatch(setLoading(false))
        })
        .catch(error => dispatch(setLoading(false)))
    }
}

export const findSportSessions = (sport, session) => {
    const len = session.length
    const indexes = []

    for (let i = 0; i < len; i++) {
        if (session[i].sport === sport)
        {
            indexes.push(i)
        }
    }
    if (indexes.length === 0)
        return {empty: true, indexes, sport}
    return {empty: false, indexes, sport}
}

export const setStudents = (payload) => {
    return {
        type: SET_STUDENTS,
        payload
    }
}


export const setTimeTable = (payload) => {
    return {
        type: SET_TIME_TABLE,
        payload
    }
}

export const setGroups = (payload) => {
    return {
        type: SET_GROUPS,
        payload
    }
}

export const setSports = (payload) => {
    return {
        type: SET_SPORTS,
        payload
    }
}

export const setLoading = (payload) => {
    return {
        type: SET_LOADING,
        payload
    }
}
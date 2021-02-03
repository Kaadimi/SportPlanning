import XLSX from 'xlsx'
import { setError } from "./Dialogs"
import { setStudents, setTimeTable, setGroups, setLoading } from "./planning"

function optimal_group_size(min, max, nb, offset)
{
    for (let i = max; i >= min; i--)
    {
        if (nb % i === 0 || nb % i >= min)
          return i
    }
    let diff = 1
    while (offset > 0 && min > diff)
    {
      if (nb % (min - diff) === 0 || nb % (min - diff) >= min)
        return (min - diff)
      else if ((nb % (max + diff) === 0 || nb % (max + diff) >= min))
        return (max + diff)
      diff++;
      offset--;
    }
    return min
}

const compatible_students = (students, sports, groupSize, sportsCount) => {
    return new Promise(resolve => {
        const len = sports.length
        const possible_choices = new Map()
        
        let index

        for (let i = 0; i < len; i++)
            possible_choices.set(i + "-" + i, [])
        for (let i = 0; i < len - 1; i++)
        {
            for (let j = i + 1; j < len; j++)
            possible_choices.set(i + "-" + j, [])
        }
        const studentLen = students.length
        for (let i = 0; i < studentLen; i++)
        {
            index = students[i].sport1
            if (index >= 0)
                sportsCount[index] += 1
            index = students[i].sport2
            if (index >= 0)
                sportsCount[index] += 1
            const current = possible_choices.get(students[i].sport1 + "-" + students[i].sport2)
            if (current) {
                current.push(i)
            }
            else {
                possible_choices.get(students[i].sport2 + "-" + students[i].sport1).push(i)
            }
        }
        for (let i = 0; i < len; i++)
        {
            const min = parseInt(sports[i].min)
            const max = parseInt(sports[i].max)
            groupSize[i] = optimal_group_size(min, max, sportsCount[i], sports[i].offset)
        }
        resolve(possible_choices)
    })
}

function find_swap(arr, i, j, len)
{
  let tmp

  for (let f = 0; f < len; f++)
  {
    if (f === i)
      continue;
    const arrLen = arr[i].length
    for (let h = 0; h < arrLen; h++)
    {
      if (arr[i].indexOf(arr[f][h]) === -1)
      {
        tmp = arr[i][j]
        arr[i][j] = arr[f][h]
        arr[f][h] = tmp
        return ;
      }
    }
  }
}

function remove_douplicates(groups)
{
    let promises = []
    const values = [...groups.values()]

    values.forEach(value => {
        promises.push(new Promise(resolve => {
            const len = value.length
            for (let i = 0; i < len; i++)
            {
                const grLen = value[i].length - 1
                for (let j = grLen; j >= 0; j--)
                {
                    if (value[i].indexOf(value[i][j]) !== j)
                        find_swap(value, i, j, len)
                    resolve(true)
                }
            }
        }))
    })
    Promise.all(promises)
}

function group_creator(possible_choices, sports, groupSize, sportsCount)
{
  
    return new Promise(async (resolve) => {
    const groups = new Map()
    const len = sports.length
    let index = -1
    let sport1, sport2, current
    let v = 0

    for (let i = 0; i < len; i++)
    {
        groups.set(i, [])
        const nbOfGroups = sportsCount[i] / groupSize[i]
        for (let j = 0; j < nbOfGroups; j++)
            groups.get(i).push([])
    }

    for (const [key, value] of possible_choices)
    {
        let valueLen = value.length
        index = key.indexOf("-")
        if (index >= 0 && valueLen > 0)
        {
        sport1 = parseInt(key.substring(0, index))
        current = groups.get(sport1)
        v = 0
        if (current)
        {
            for (let i = 0; i < valueLen; i++)
            {
            while (v < current.length && current[v].length === groupSize[sport1])
                v++;
            current[v].push(value[i])
            }
        }
        sport2 = parseInt(key.substring(index + 1, key.length))
        current = groups.get(sport2)
        v = 0
        if (current)
        {
            for (let i = 0; i < valueLen; i++)
            {
            while (v < current.length && current[v].length === groupSize[sport2])
                v++;
            current[v].push(value[i])
            }
        }
        }
    }

    await remove_douplicates(groups)
    resolve(groups)
  })
}

export const map_to_array = (map) => {
    const arr = []
    let i = 0;

    for (let [key, value] of map) {
        let len = value.length;

        for (let j = 0; j < len; j++)
        {
            arr.push({id: i, class: j, sport: key, students: value[j]})
            i++
        }
    }
    return arr;
}

const split_choices = (data, sports) => {
    return new Promise((resolve, reject) => {
      const len = data.length;
      const sportsLen = sports.length
      const sportMap = new Map([...sports.entries()].map(sport => [sport[1].name.toLowerCase(), sport[0]]))
      const students = []
      const letters = /^[a-zA-Z\s]*$/;

      if (sportsLen === 0)
        return reject("noSportError")
      for (let i = 0; i < len; i++)
      {
        const {Firstname, Lastname, School, Establishment, Sport1, Sport2} = data[i]
        if (Firstname && Lastname && School && Establishment && Sport1 && Sport2)
        {
          if (!Firstname[0].match(letters) || !Lastname[0].match(letters))
            continue
          const firstChoice = Sport1.trim().toLowerCase()
          if (sportMap.has(firstChoice))
          {
              const secondChoice = Sport2.trim().toLowerCase() 
              if (sportMap.has(secondChoice))
                students.push({name: `${Firstname} ${Lastname}`, School, Establishment, sport1: sportMap.get(firstChoice), sport2: sportMap.get(secondChoice)})
              else
                return reject('undefiendSport')
          }
          else
                return reject('undefiendSport')
        }
        else
          return reject("badFile")
      }
      resolve(students)
    })
}

const generateGroups = (students, sports) => {
    return new Promise((resolve) => {
        const sportsLen = sports.length
        const groupSize = new Array(sportsLen).fill(0)
        const sportsCount = new Array(sportsLen).fill(0)
        compatible_students(students, sports, groupSize, sportsCount)
        .then(compatible => group_creator(compatible, sports, groupSize, sportsCount))
        .then(groupMap =>  map_to_array(groupMap))
        .then(groups => resolve({groups, groupSize, sportsCount}))
    })
}

const file_type = (fileName) => {
    const ext = fileName.split(".").pop().toUpperCase()
    const excelTypes = ["XLS", "XLSX"]

    if (excelTypes.includes(ext))
      return true;
    return false
}

export const readExcel = (file, inputForm, sports, timeTable) => {
    return dispatch => {
        dispatch(setLoading(true))
        if (file) {
            const promise = new Promise((resolve, reject) => {
                if (!file_type(file.name))
                    return reject("wrongFormat")
                const fileReader = new FileReader()
                fileReader.readAsArrayBuffer(file)
        
                fileReader.onload = (e) => {
                const bufferArray = e.target.result
        
                const workBook = XLSX.read(bufferArray, {type: 'buffer'})
                const workSheetName = workBook.SheetNames[0]
                const workSheet = workBook.Sheets[workSheetName]
                const data = XLSX.utils.sheet_to_json(workSheet)
                resolve(data)
            }
                fileReader.onerror = (error) => reject(error)
            })
            promise.then(data => split_choices(data, sports))
            .then(students => {
                dispatch(setStudents({students, sports, file: file.name}))
                if (timeTable)
                    dispatch(setTimeTable({timeTable: null, clashes: null, cost: 0})) 
                generateGroups(students, sports)
                .then(groups => {
                    dispatch(setLoading(false))
                    dispatch(setGroups(groups))
                })
            })
            .catch(error => {dispatch(setLoading(false));inputForm.current.reset();dispatch(setError(error))})
        }
        else
            dispatch(setError("fileError"))   
    }
}


function excel_format(timeTable, groups, students, sports)
{
  return new Promise ((resolve) => {
    const result = []
    const promises = []

    const days = timeTable.length
    promises.push(new Promise((resolve) => {
        for (let i = 0; i < days; i++)
        {
          const sessions = timeTable[i].length
          for (let j = 0; j < sessions; j++)
          {
            const activity = timeTable[i][j].length
            for (let h = 0; h < activity; h++)
            {
              const group = timeTable[i][j][h].group
              const groupLen = groups[group].students.length;
              for (let k = 0; k < groupLen; k++)
              {
                const {name, School, Establishment} = students[groups[group].students[k]]
                result.push({Name: name, School, Establishment, Sport: sports[timeTable[i][j][h].sport], Group: + group, Day: i + 1, Session: j + 1})
                resolve(true)
            }
            }
          }
        }
    }))
    Promise.all(promises).then(resolve(result))
  })
}

export async function downloadPlanning(timeTable, groups, students, labels)
{
    const data = await excel_format(timeTable, groups, students, labels)

    let binaryWS = XLSX.utils.json_to_sheet(data); 

    // Create a new Workbook
    var wb = XLSX.utils.book_new() 

    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Planning') 

    // export your excel
    XLSX.writeFile(wb, 'SportPlanning.xlsx');
}
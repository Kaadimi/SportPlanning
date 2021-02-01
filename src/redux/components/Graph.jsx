import React from 'react'
import { Bar } from 'react-chartjs-2'
import "../styles/Dialogs.css"
import { useTranslation } from 'react-i18next'

function Graph({sportsCount, groupSize, labels, colors, setDialog}) {
    const { t } = useTranslation();
    const datasets = [{
        label: t('sportChoice'),
        data: sportsCount,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 3,
        options: {
            legend: {
                fillStyle: '#ffffff',
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: '#ffffff'
                }
            }
        }
    }, {
      label: t('groupSize'),
      data: groupSize,
      backgroundColor: "white",
      borderColor: "red"
    },]

    return (
        <div className="dialogBackground">
            <div id="graphDiv">
                <div id="sportDialogHeader">
                    <span id="sportDialogTitle">{t('studentChoices')}</span>
                    <button id="closeSportBtn" onClick={(e) => {e.preventDefault();setDialog(0)}}>
                        <img alt="closeIcon" src={process.env.PUBLIC_URL + "close.svg"}></img>
                    </button>
                </div>
                <div id="graphInnerDiv">
                    <Bar  data={{labels, datasets}} width={300} height={200} options={{ maintainAspectRatio: false }}/>
                </div>
            </div>
        </div>
    )
}

export default Graph

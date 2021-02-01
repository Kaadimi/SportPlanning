import React from 'react'
import { useTranslation } from 'react-i18next';

function PlanningBanner() {
    const { t, i18n } = useTranslation();

    return (
        <div id="planningTopContainer">
            <div id="bannerLogo">
                <img alt="planningLogo" src={process.env.PUBLIC_URL + "/calendar.svg"}></img>
                <h1>PLANNER</h1>
            </div>
            <span>{t('slogan')}</span>
            <div className="languagesDiv">
                <button onClick={() => i18n.changeLanguage('fr')}>FR</button>
                <div id="verticalDivider"></div>
                <button onClick={() => i18n.changeLanguage('en')}>EN</button>
            </div>
        </div>
    )
}

export default PlanningBanner

import { useDispatch } from 'react-redux'
import { setError } from '../actions/Dialogs';
import "../styles/Dialogs.css"
import { useTranslation } from 'react-i18next'

function Error({ error }) {
    const { t } = useTranslation();
    const dispatch = useDispatch()

    return (
        <div id="dialogContainer">
            {error && <div className="errorDiv">
                <img alt="warningIcon" src={process.env.PUBLIC_URL + "/warning.svg"}></img>
                <p><span>{t('sorry')}, </span>{error}</p>
                <button onClick={() => dispatch(setError(null))} id="closeError">
                    <img alt="closeIcon" src={process.env.PUBLIC_URL + "/close.svg"}></img> 
                </button>
            </div>}
        </div>
    )
}

export default Error

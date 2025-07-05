import {useTranslation} from "react-i18next";

const LanguageChanger = () => {
    const {i18n} = useTranslation();
    const changeLanguage = (lang:string) => {
        i18n.changeLanguage(lang);
    }
    return (
        <div style={{display:'flex',gap:'1rem'}}>
            <button onClick={()=>changeLanguage('es')}>Español</button>
            <button onClick={()=>changeLanguage('en')}>English</button>
        </div>
    )
}

export default LanguageChanger;
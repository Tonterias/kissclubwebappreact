import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";


type Props = {
    onClick: () => void;
}
const OptionsDialogue = ({onClick}:Props) => {
    const {t} = useTranslation();
    return (
        <div style={{
            height: "3rem",
            width: "8rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "0.5rem",
            boxShadow:"0px 0px 2px black",
            color:"black",
            fontFamily:"Poppins",
        }}
        className={"forgot-password-btn"}
             onClick={onClick}
        >
            <FontAwesomeIcon icon={faBan} size={"1x"}/>
            <p>{t('block')}</p>
        </div>
    )
}
export default OptionsDialogue;
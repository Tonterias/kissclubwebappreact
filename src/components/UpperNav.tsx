import {faBars} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";

type Props = {
    label: string;
}
const UpperNav = ({label}: Props) => {
    const  navigate = useNavigate();
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: '5rem',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
            borderTop: '1px solid #eaeaea',
            zIndex: 99999,
            color: "black"
        }}>
            <div
                style={{
                    padding: 10,
                    borderRadius: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: "black",
                    fontFamily: "Poppins",
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    userSelect: 'none'
                }}
            >
                <p style={{
                    userSelect: 'none'
                }}>{label}</p>
                <FontAwesomeIcon icon={faBars} size="lg" color={"black"} style={{position: "absolute", right: "1rem"}}
                                 className={"forgot-password-btn"} onClick={()=>navigate('/settings')}/>
            </div>
        </div>
    )
}

export default UpperNav;
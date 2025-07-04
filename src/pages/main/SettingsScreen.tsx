import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {MainButton} from "../../components/Buttons.tsx";
import {auth} from "../../services/firebaseConfig.tsx";
import {signOut} from "firebase/auth"
import {useEffect, useState} from "react";
const SettingsScreen = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [email, setEmail] = useState<string>('');

    const logout =async ()=>{
        try {
            await signOut(auth);
            navigate('/user/login');
        }catch(e) {
            console.error(e);
        }
    }
    useEffect(() => {
        const user = auth.currentUser;
        if (user){
            // @ts-ignore
            setEmail(user.email);
            }else setEmail('')
    },[])
    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            backgroundColor: 'white',
            color: "black",
            fontFamily: "Poppins",
        }}>
            <div style={{position: 'relative', top: 30, left: 15, display: "flex", gap: "0.5rem", alignItems: "center"}}>
                <FontAwesomeIcon icon={faArrowLeft} size="2x" color={"black"} className="forgot-password-btn"
                                 onClick={() => navigate(-1)}/>
                <p style={{fontSize: "2rem", fontWeight: "600"}}>{t('settings')}</p>
            </div>

            <div style={{marginTop: "4rem", width: "100vw",display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div style={{width:"90vw",display:"flex",flexDirection:"column",alignItems:"start",textAlign:"start"}}>
                    <p style={{fontSize:"1.3rem",fontWeight:"600"}}>{t('email')}</p>
                    <p style={{fontSize:"1.1rem",fontWeight:"200"}}>{email!='' ? email : "Loading..."}</p>
                </div>
            </div>

            <div style={{marginTop:"1rem",width: "100vw",display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div style={{width:"90vw",display:"flex",flexDirection:"column",alignItems:"start",textAlign:"start"}} className={"forgot-password-btn"} onClick={()=>navigate('/blocked/users')}>
                    <div style={{display:"flex",alignItems:"center",width:"90vw",justifyContent:"space-between"}} >
                        <p style={{fontSize:"1.3rem",fontWeight:"600"}}>{t('blocked_users')}</p>
                        <FontAwesomeIcon icon={faArrowRight} size="1x" color={"black"} className="forgot-password-btn" style={{justifySelf:"end"}}/>
                    </div>
                    <p style={{fontSize:"1.1rem",fontWeight:"200"}}>{t('the_people_you_blocked_are_displayed_here')}</p>
                </div>
            </div>

            <div style={{width:"100vw",display:"flex",marginTop:"2rem",justifyContent:"center"}}>
                <MainButton title={t('log_out')} color={"white"} onClick={logout}/>
            </div>
        </div>
    )
}

export default SettingsScreen;
import logo from "../../assets/images/kiss_club.png";
import {useTranslation} from "react-i18next";
import {SignInWithGoogle} from "../../services/authService.tsx";
import googleLogo from "../../assets/images/google.png";
import '../../styles/auth.css'
import {MainButton, SimpleButton} from "../../components/Buttons.tsx";
import {useNavigate} from "react-router-dom";
import LanguageChanger from "../../components/languageChanger.tsx";

const WelcomeScreen = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();

    /*
        const [result,setResult] = useState([]);
    */
    const signIn = async () => {
        const result = await SignInWithGoogle();
        if (result){
            const emailVerified = result.emailVerified;
            if(emailVerified){
                navigate("/homescreen");
            }else
                navigate("/phone]");
        }
    }
    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            width: '100vw',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20vh',
        }}>
            <div style={{marginTop: '5rem'}}>
                <img src={logo} alt="Kiss club logo" style={{height: "5rem", width: "10rem"}}/>
                <p style={{
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    fontSize: "2rem",
                    color: "black"
                }}>{t('app_name')}</p>
                <p style={{
                    fontFamily: "Poppins",
                    fontWeight: "lighter",
                    fontSize: "1rem",
                    color: "black"
                }}>{t('lets_dive_into_your_account')}</p>
            </div>

            <div style={{
                display: "flex",
                justifyContent: 'center',
                alignItems: "center",
                width: '100vw',
                flexDirection: 'column'
            }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        backgroundColor: "white",
                        border: "1px solid grey",
                        width: '80vw',
                        borderRadius: "2rem",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        paddingTop: "1rem",
                        paddingBottom: "1rem",
                    }}
                    className='button-signin'
                    onClick={()=>signIn()}
                >
                    <img
                        src={googleLogo}
                        alt={"google"}
                        style={{height: "1.5rem", width: "1.5rem"}}
                    />
                    <p style={{margin: 0,color:"black"}}>{t("continue_with_google")}</p>
                </div>
                <div style={{marginTop: '2rem'}}>
                    <MainButton title={t('login')} color={"white"} onClick={() =>navigate('/signin')}/>
                </div>
                <div style={{
                    width: '90vw',
                    marginTop: '2rem',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    color:"black",
                    marginBottom:"1rem"
                }}>
                    <p style={{fontFamily: "Poppins"}}>{t('donot_have_account')}</p>
                    <SimpleButton title={t('sign_up')} color={"red"} onClick={()=>navigate('/signup')}/>
                </div>

                <LanguageChanger/>
            </div>


            <p style={{color:"grey"}}>v1.1.1b20</p>
        </div>
    )
}


export default WelcomeScreen;
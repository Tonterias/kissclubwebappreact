import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft, faEnvelope, faEye, faEyeSlash, faLock} from '@fortawesome/free-solid-svg-icons';
import {useTranslation} from "react-i18next";
import EmailTextInput from "../../components/TextInputs.tsx";
import {useEffect, useState} from "react";
import {MainButton, SimpleButton} from "../../components/Buttons.tsx";
import '../../styles/auth.css'
import Text from "../../components/customText.tsx";
import {useNavigate} from "react-router-dom";
import {analytics, auth} from "../../services/firebaseConfig";
import {signInWithEmailAndPassword} from 'firebase/auth';
import {toast} from "react-toastify";
import Loader from "../../components/loader.tsx";
import {logEvent} from "firebase/analytics";

const LoginScreen = () => {
    const {t} = useTranslation();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        logEvent(analytics, 'screen_view', {
            firebase_screen: 'login_screen',
            firebase_screen_class: 'AuthScreen',
        });
    }, []);
    const handleLogin = async () => {
        setLoading(true);
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            if (user) {
                logEvent(analytics, 'user_login', {
                    method :"email"
                });
                navigate('/')
                setLoading(false);
            }
        } catch (err) {
            // @ts-ignore
            console.error('Login failed:', err.message);
            setLoading(false);
        }
    };

    const navigate = useNavigate();
    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            gap: "1.5rem"
        }}>
            <div style={{position: 'absolute', top: 30, left: 15}} className="forgot-password-btn"
                 onClick={() => navigate('/welcome')}>
                <FontAwesomeIcon icon={faArrowLeft} size="2x" color={"black"}/>
            </div>

            <div style={{width: '90vw', marginTop: '5rem', color: 'black'}}>
                <p style={{
                    fontFamily: "Poppins",
                    fontWeight: 700,
                    fontSize: "2rem",
                    textAlign: "start"
                }}>{t('welcomeBack')}</p>
                <p style={{
                    fontFamily: "Poppins",
                    fontWeight: "lighter",
                    fontSize: "1rem",
                    textAlign: "start"
                }}>{t('pleaseEnterEmailAndPassword')}</p>
            </div>

            {/*Inputs*/}
            <div style={{position: "relative", display: 'flex', flexDirection: 'column', color: "black"}}>
                <EmailTextInput label={t('email')} type={"email"} placeholder={t('email')} icon={faEnvelope}
                                value={email} onChange={(text) => setEmail(text.target.value)}/>
                <div style={{position: "relative", marginTop: "1rem"}}>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}
                                     style={{position: "absolute", right: 20, top: 55, zIndex: 99}}
                                     onClick={() => setShowPassword(!showPassword)}/>
                    <EmailTextInput label={t('password')} type={showPassword ? "text" : "password"}
                                    placeholder={t('password')} icon={faLock} value={password}
                                    onChange={(text) => setPassword(text.target.value)}/>

                </div>
            </div>

            <div style={{width: '90vw', display: 'flex', justifyContent: "end"}} className="forgot-password-btn">
                <SimpleButton title={t('forgotPassword')} color={"#FF0000"}/>
            </div>

            <div style={{width: '90vw', marginTop: '2rem', borderTop: "1px solid grey"}}>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <Text color={"black"} size={"16px"} fontWeight={"200"} text={t('donot_have_account')}/>
                    <Text color={"red"} size={"16px"} fontWeight={"200"} text={t('sign_up')}
                          className={"forgot-password-btn"} onClick={() => navigate('/signup')}/>
                </div>
            </div>
            <div style={{position: "absolute", bottom: "2rem"}}>
                {loading ? (
                    <Loader loading={loading} color={"red"}/>
                ) : (
                    <MainButton
                        title={t('login')}
                        color={"white"}
                        onClick={() => {
                            if (email !== '' && password !== '') {
                                handleLogin();
                            } else {
                                toast.error("Invalid email or password");
                            }
                        }}
                    />
                )}
            </div>


        </div>
    );
};

export default LoginScreen;

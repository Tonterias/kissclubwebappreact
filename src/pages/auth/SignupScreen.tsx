import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {MainButton, MainButtonInactive} from "../../components/Buttons";
import {faArrowLeft, faEnvelope, faEye, faEyeSlash, faLock} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import EmailTextInput from '../../components/TextInputs'
import Text from '../../components/customText'
import {auth} from "../../services/firebaseConfig";
import {createUserWithEmailAndPassword} from 'firebase/auth'
import {toast} from "react-toastify";

const SignUpScreen = () => {
    const {t} = useTranslation();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [checkbox, setCheckbox] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential;
        } catch (error: any) {
            console.error('Signup failed:', error.message);
            if (error.code === 'auth/email-already-in-use') {
                toast.error('This email is already in use.');
            } else if (error.code === 'auth/invalid-email') {
                toast.error('Invalid email format.');
            } else if (error.code === 'auth/weak-password') {
                toast.error('Password should be at least 6 characters.');
            } else {
                toast.error('Signup failed. Please try again.');
            }
            return null;
        }
    };
    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            gap: "1.5rem",
            // overflow: 'scroll',
            paddingBottom: '180px'
        }}>
            <div style={{position: 'absolute', top: 30, left: 15}} className="forgot-password-btn"
                 onClick={() => navigate('/welcome')}>
                <FontAwesomeIcon icon={faArrowLeft} size="2x" color={"black"}/>
            </div>

            <div style={{width: '90vw', marginTop: '5rem', color: "black"}}>
                <p style={{
                    fontFamily: "Poppins",
                    fontWeight: 700,
                    fontSize: "2rem",
                    textAlign: "start"
                }}>{t('create_account')}</p>
                <p style={{
                    fontFamily: "Poppins",
                    fontWeight: "lighter",
                    fontSize: "1rem",
                    textAlign: "start"
                }}>{t('create_account_in_second')}</p>
            </div>

            {/*Inputs*/}
            <div style={{position: "relative", display: 'flex', flexDirection: 'column', color: "black"}}>
                <EmailTextInput label={t('email')} type={"email"} placeholder={t('email')} icon={faEnvelope}
                                value={email} onChange={(e) => {
                    setEmail(e.target.value)
                }}/>
                <div style={{position: "relative", marginTop: "1rem", color: "black"}}>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}
                                     style={{position: "absolute", right: 20, top: 55, zIndex: 99}}
                                     onClick={() => setShowPassword(!showPassword)}/>
                    <EmailTextInput label={t('password')} type={showPassword ? "text" : "password"}
                                    placeholder={t('password')} icon={faLock} value={password} onChange={(e) => {
                        setPassword(e.target.value)
                    }}/>
                </div>
                <div style={{position: "relative", marginTop: "1rem", color: "black"}}>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}
                                     style={{position: "absolute", right: 20, top: 55, zIndex: 99}}
                                     onClick={() => setShowPassword(!showPassword)}/>
                    <EmailTextInput label={t('confirm_password')} type={showPassword ? "text" : "password"}
                                    placeholder={t('confirm_password')} icon={faLock} value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value)
                                    }}/>
                </div>
            </div>

            <div
                style={{
                    width: '90vw',
                    display: 'flex',
                    marginTop: 10,
                    gap: '0.5rem',
                }}
            >
                <input
                    type="checkbox"
                    style={{
                        accentColor: "#FF0000",
                        height: '1.5rem',
                        width: '1.5rem',
                    }}
                    checked={checkbox}
                    onClick={() => setCheckbox(!checkbox)}
                />

                <div
                    style={{
                        width: "80vw",
                        display: "flex",
                        flexWrap: "wrap",
                        textAlign: "left",
                        fontFamily: "Poppins",
                        color: "black"
                    }}
                >
                    <span>{t('i_agree_')} </span>
                    <span><a style={{
                        color: "#FF0000",
                        textDecoration: "underline",
                        cursor: "pointer",
                        paddingLeft: "0.2rem"
                    }}
                             href="https://kissclub.es/privacy"
                             target="_blank"
                             rel="noopener noreferrer">{t('privacy_policy')},</a></span>
                    <span><a style={{color: "#FF0000", textDecoration: "underline", cursor: "pointer"}}
                             href="https://kissclub.es/cookies"
                             target="_blank"
                             rel="noopener noreferrer"
                    >{t('cookies_policy')} </a> & </span>
                    <span><a style={{color: "#FF0000", textDecoration: "underline", cursor: "pointer"}}
                             href="https://kissclub.es/terms-of-use"
                             target="_blank"
                             rel="noopener noreferrer"
                    >{t('terms_of_use')}</a></span>
                </div>
            </div>


            <div style={{width: '90vw', marginTop: '2rem', borderTop: "1px solid grey"}}>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <Text color={"black"} size={"16px"} fontWeight={"200"} text={t('already_have_account')}/>
                    <Text color={"red"} size={"16px"} fontWeight={"200"} text={t('login')}
                          className={"forgot-password-btn"} onClick={() => navigate('/signin')}/>
                </div>
            </div>
            <div style={{position: "fixed", bottom: "0.5rem"}}>
                {
                    checkbox ?  <MainButton
                        title={t('sign_up')}
                        color="white"
                        onClick={async () => {
                            if (email !== '' && password !== '' && confirmPassword !== '' && checkbox) {
                                if (password === confirmPassword) {
                                    const result = await handleSignup();
                                    if (result != null) {
                                        navigate('/verification');
                                    }
                                } else {
                                    toast.error('Passwords do not match.')
                                }

                            } else {
                                toast.error('Please enter all the required information.')

                            }
                        }}
                    /> :<MainButtonInactive
                        title={t('sign_up')}
                        color="white"
                    />
                }

            </div>

        </div>

    )
}

export default SignUpScreen;
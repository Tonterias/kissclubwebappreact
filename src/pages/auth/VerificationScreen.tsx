import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import Text from "../../components/customText";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {auth} from "../../services/firebaseConfig.tsx";
import {OutlineButton, SimpleButton} from "../../components/Buttons.tsx";
import '../../styles/auth.css'
import {sendEmailVerification} from "firebase/auth";
import Loader from "../../components/loader.tsx";

const VerificationScreen = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleResendVerificationEmail = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                await sendEmailVerification(user);
                alert("Verification email sent successfully!");
            } catch (error: any) {
                console.error("Error sending verification email:", error.message);
            }
        } else {
            alert("No user is currently signed in.");
        }
    };

    const handleVerificationEmail = async () => {
        const user = auth.currentUser;
        setLoading(true);

        if (user) {
            await user.reload();
            const emailVerified = user.emailVerified;
            if (emailVerified) {
                navigate('/');
                setLoading(false);
            } else {
                navigate('/verification');
                setLoading(false);
            }
        } else {
            navigate('/verification');
            setLoading(false);
        }
    };

    useEffect(() => {
        let hasSent = false;

        const checkUser = async () => {
            const user = auth.currentUser;
            if (user) {
                // @ts-ignore
                setEmail(user.email);
            }
            if (!hasSent) {
                hasSent = true;
                await handleResendVerificationEmail();
            }
        };

        checkUser();
    }, []);


    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
        }}>
            <div style={{position: 'absolute', top: 30, left: 15}} className="forgot-password-btn"
                 onClick={() => navigate(-1)}>
                <FontAwesomeIcon icon={faArrowLeft} size="2x" color={"black"}/>
            </div>

            <div
                style={{
                    width: '80vw',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    color: "black",
                    gap: "1rem"
                }}>
                <div style={{
                    border: "1px solid black",
                    height: "5rem",
                    width: "5rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%"
                }}>
                    <FontAwesomeIcon icon={faEnvelope} size="2x"/>
                </div>
                <Text color={"black"} size={"2rem"} fontWeight={"600"} text={t('check_your_email')}/>
                <div style={{display: "flex", gap: "0.2rem", fontFamily: "Poppins"}}>
                    <p>{t('we_have_sent')}<span> {email}</span> <span>{t('click_the_link_inside_to')}</span></p>
                </div>
                <div className="forgot-password-btn">
                    <SimpleButton title={t('resend_mail')} color={"#FF0000"}
                                  onClick={() => handleResendVerificationEmail()}/>
                </div>

                <div style={{position: "absolute", bottom: "5rem"}}>
                    {
                        loading ? <Loader loading={loading} color={"red"}/> :
                            <OutlineButton title={t("i_have_verified")} color={"#FF0000"}
                                           onClick={() => handleVerificationEmail()}/>
                    }
                </div>
            </div>
        </div>
    )
}

export default VerificationScreen;
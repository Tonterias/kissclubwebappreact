import ProgressBar from "../../components/ProgressBar";
import Text from "../../components/customText.tsx";
import {useTranslation} from "react-i18next";
import {TextInputPhone} from "../../components/TextInputs.tsx";
import {useEffect, useState} from "react";
import {MainButton} from "../../components/Buttons.tsx";
import {analytics, auth, db} from "../../services/firebaseConfig.tsx";
import {doc, updateDoc} from "firebase/firestore";
import {useNavigate} from "react-router-dom";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {toast} from "react-toastify";
import Loader from "../../components/loader.tsx";
import {logEvent} from "firebase/analytics";

const PhoneInputScreen = () => {
    const {t} = useTranslation();
    const [phone, setPhone] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const fetchData = async () => {
        const user = auth.currentUser;
        setLoading(true);
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            try {
                await updateDoc(userRef, {
                    isNewUser: false,
                    number: phone
                });
                logEvent(analytics, 'onboarding_progress', {
                    step_number :2,
                    step_name:"telephone_number"
                });
                navigate('/name')
                setLoading(false);
            } catch (error) {
                console.error('Error updating number:', error);
                setLoading(false);
            }
        }
    };
    useEffect(() => {
        logEvent(analytics, 'screen_view', {
            firebase_screen: 'phone_screen',
            firebase_screen_class: 'Onboarding',
        });
    }, []);
    return (
        <div style={{height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <div style={{position: 'absolute', top: 30, left: 30}} className="forgot-password-btn"
                 onClick={() => navigate('/welcome')}>
                <FontAwesomeIcon icon={faArrowLeft} color={"black"} style={{
                    height: "1.5rem",
                    width: "1.5rem",
                }}/>
            </div>
            <div style={{marginTop: '2rem'}}>
                <ProgressBar width={"10vw"}/>
            </div>

            <div
                style={{
                    width: '90vw',
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '1rem',
                    justifyContent: 'start',
                    alignItems: 'start',
                    color: 'black',
                    textAlign: "start",
                    gap: "1rem",
                    padding: "1.2rem"
                }}
            >
                <Text
                    color="black"
                    size={'1.5rem'}
                    fontWeight="700"
                    text={t('can_we_get_ur_number')}
                />
                <Text
                    color="black"
                    size="1rem"
                    fontWeight="normal"
                    text={t('phone_verification_info')}
                />
            </div>

            <div style={{
                width: '90vw',
                position: 'relative',
                color: 'black',
                display: "flex",
                justifyContent: 'center',
                marginTop: "1rem"
            }}>
                <TextInputPhone type={'tel'} placeholder={''} icon={''} onChange={(text) => {
                    const onlyNums = text.target.value.replace(/\D/g, '');
                    setPhone(onlyNums);
                }} value={phone} label={''} maxLength={9}/>
            </div>

            <div style={{position: "absolute", bottom: "5rem"}}>
                {
                    loading ? <Loader loading={loading} color={"red"}/> :
                        <MainButton title={t('continue_button')} color={'white'} onClick={() => {
                            if (phone != '' && phone.length === 9)
                                fetchData()
                            else toast.error('Please enter valid phone number');
                        }}/>
                }
            </div>

        </div>
    )
}

export default PhoneInputScreen;
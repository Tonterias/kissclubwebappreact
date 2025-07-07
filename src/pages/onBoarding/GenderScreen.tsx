import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {analytics, auth, db} from "../../services/firebaseConfig.tsx";
import {doc, updateDoc} from "firebase/firestore";
import ProgressBar from "../../components/ProgressBar.tsx";
import Text from "../../components/customText.tsx";
import {MainButton, OutlineButton} from "../../components/Buttons.tsx";
import '../../styles/auth.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import Loader from "../../components/loader.tsx";
import {toast} from "react-toastify";
import {logEvent} from "firebase/analytics";

const GenderScreen = () => {
    const {t} = useTranslation();
    const [selected, setSelected] = useState<number>(1);
    //1 for man , 2 for women , 3 for other
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        const user = auth.currentUser;
        setLoading(true);
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            try {
                await updateDoc(userRef, {
                    gender: selected === 1 ? 'MALE' : selected === 2 ? 'FEMALE' : selected === 3 ? 'OTHER' : null
                });
                logEvent(analytics, 'onboarding_progress', {
                    step_number :5,
                    step_name:"gender"
                });
                navigate('/options')
                setLoading(false);
            } catch (error) {
                console.error('Error updating gender:', error);
                setLoading(false);
            }
        }
    };
    useEffect(() => {
        logEvent(analytics, 'screen_view', {
            firebase_screen: 'gender_screen',
            firebase_screen_class: 'Onboarding',
        });
    }, []);
    return (
        <div style={{height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <div style={{position: 'absolute', top: 30, left: 30}} className="forgot-password-btn"
                 onClick={() => navigate(-1)}>
                <FontAwesomeIcon icon={faArrowLeft} color={"black"} style={{
                    height: "1.5rem",
                    width: "1.5rem",
                }}/>
            </div>
            <div style={{marginTop: '2rem'}}>
                <ProgressBar width={"40vw"}/>
            </div>
            <div
                style={{
                    width: '90vw',
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '1rem',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    textAlign: "start",
                    gap: "0.5rem",
                }}
            >
                <Text
                    color="black"
                    size={'1.5rem'}
                    fontWeight="700"
                    text={t('gender_title')}
                />
                <Text
                    color="black"
                    size="1rem"
                    fontWeight="normal"
                    text={t('gender_info')}
                    className="text-align"
                />
            </div>

            {
                selected === 1 ? <div style={{
                    width: '90vw',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    color: "black",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "3rem"
                }}>
                    <MainButton title={t('man')} color={"white"} onClick={() => setSelected(1)}/>
                    <OutlineButton title={t('woman')} onClick={() => setSelected(2)}/>
                    <OutlineButton title={t('other')} onClick={() => setSelected(3)}/>
                </div> : selected === 2 ? <div style={{
                    width: '90vw',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    color: "black",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "3rem"


                }}>
                    <OutlineButton title={t('man')} onClick={() => setSelected(1)}/>
                    <MainButton title={t('woman')} color={"white"} onClick={() => setSelected(2)}/>
                    <OutlineButton title={t('other')} onClick={() => setSelected(3)}/>
                </div> : selected === 3 ? <div style={{
                    width: '90vw',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    color: "black",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "3rem"

                }}>
                    <OutlineButton title={t('man')} onClick={() => setSelected(1)}/>
                    <OutlineButton title={t('woman')} onClick={() => setSelected(2)}/>
                    <MainButton title={t('other')} color={"white"} onClick={() => setSelected(3)}/>
                </div> : null
            }

            <div style={{position: "absolute", bottom: "5rem"}}>
                {
                    loading ? <Loader loading={loading} color={"red"}/> :
                        <MainButton title={t('continue_button')} color={'white'} onClick={() => {
                            if (selected === 1 || selected === 2 || selected === 3)
                                fetchData()
                            else toast.error('Error');
                        }}/>
                }
            </div>

        </div>

    )
}

export default GenderScreen;
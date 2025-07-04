import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {auth, db} from "../../services/firebaseConfig.tsx";
import {doc, updateDoc, arrayUnion} from "firebase/firestore";
import ProgressBar from "../../components/ProgressBar.tsx";
import Text from "../../components/customText.tsx";
import {MainButton, OutlineButton} from "../../components/Buttons.tsx";
import '../../styles/auth.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import Loader from "../../components/loader.tsx";
import {toast} from "react-toastify";

const MeetingOptions = () => {
    const {t} = useTranslation();
    const [selected, setSelected] = useState<number>(1);
    //1 for MALE , 2 for FEMALE , 3 for ALL
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        const user = auth.currentUser;
        setLoading(true);
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            try {
                await updateDoc(userRef, {
                    whoWantToMeet: selected === 1 ? arrayUnion('MALE') : selected === 2 ? arrayUnion('FEMALE') : selected === 3 ? arrayUnion('ALL') : null
                });
                navigate('/goals')
                setLoading(false);
            } catch (error) {
                console.error('Error updating options:', error);
                setLoading(false);
            }
        }
    };
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
                <ProgressBar width={"50vw"}/>
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
                    gap: "0.5rem"
                }}
            >
                <Text
                    color="black"
                    size={'1.5rem'}
                    fontWeight="700"
                    text={t('who_to_meet')}
                />
                <Text
                    color="black"
                    size="1rem"
                    fontWeight="normal"
                    text={t('who_to_meet_info')}
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
                    marginTop: "3rem"


                }}>
                    <MainButton title={t('man')} color={"white"} onClick={() => setSelected(1)}/>
                    <OutlineButton title={t('woman')} onClick={() => setSelected(2)}/>
                    <OutlineButton title={t('all')} onClick={() => setSelected(3)}/>
                </div> : selected === 2 ? <div style={{
                    width: '90vw',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    color: "black",
                    marginTop: "3rem"


                }}>
                    <OutlineButton title={t('man')} onClick={() => setSelected(1)}/>
                    <MainButton title={t('woman')} color={"white"} onClick={() => setSelected(2)}/>
                    <OutlineButton title={t('all')} onClick={() => setSelected(3)}/>
                </div> : selected === 3 ? <div style={{
                    width: '90vw',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    color: "black",
                    marginTop: "3rem"


                }}>
                    <OutlineButton title={t('man')} onClick={() => setSelected(1)}/>
                    <OutlineButton title={t('woman')} onClick={() => setSelected(2)}/>
                    <MainButton title={t('all')} color={"white"} onClick={() => setSelected(3)}/>
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

export default MeetingOptions;
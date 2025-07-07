import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {analytics, auth, db} from "../../services/firebaseConfig.tsx";
import {doc, updateDoc} from "firebase/firestore";
import ProgressBar from "../../components/ProgressBar.tsx";
import Text from "../../components/customText.tsx";
import {MainButton} from "../../components/Buttons.tsx";
import '../../styles/auth.css'
import cake from '../../assets/images/birthday.png'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {toast} from "react-toastify";
import Loader from "../../components/loader.tsx";
import {logEvent} from "firebase/analytics";

const BirthdayScreen = () => {
    const {t} = useTranslation();
    const [day, setDay] = useState<string>('');
    const [month, setMonth] = useState<string>('');
    const [year, setYear] = useState<string>('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        const user = auth.currentUser;
        setLoading(true);
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            try {
                await updateDoc(userRef, {
                    day: day,
                    month: month,
                    year: year
                });
                logEvent(analytics, 'onboarding_progress', {
                    step_number :4,
                    step_name:"date_of_birth"
                });
                navigate('/gender')
                setLoading(false);
            } catch (error) {
                console.error('Error updating Birthday:', error);
                setLoading(false);
            }
        }
    };
    useEffect(() => {
        logEvent(analytics, 'screen_view', {
            firebase_screen: 'birthday_screen',
            firebase_screen_class: 'Onboarding',
        });
    }, []);
    return (
        <div style={{height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <div style={{position: 'absolute', top: 30, left: 30}} className="forgot-password-btn"
                 onClick={() => navigate(-1)}>
                <FontAwesomeIcon icon={faArrowLeft}  color={"black"} style={{
                    height:"1.5rem",
                    width:"1.5rem",
                }}/>
            </div>
            <div style={{marginTop: '2rem'}}>
                <ProgressBar width={"30vw"}/>
            </div>

            <div
                style={{
                    width: '90vw',
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '1rem',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    textAlign:"start",
                    gap:"0.5rem",
                }}
            >
                <Text
                    color="black"
                    size={'1.5rem'}
                    fontWeight="700"
                    text={t('birthday_title')}
                />
                <Text
                    color="black"
                    size="1rem"
                    fontWeight="normal"
                    text={t('birthday_info')}
                    className="text-align"
                />
            </div>

            <div style={{
                width: '90vw',
                position: 'relative',
                height: '25vh',
                backgroundColor: "white",
                borderRadius: '0.5rem',
                boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.2)',
                marginTop: '5rem',
                paddingBottom:"1rem",
            }}>
                <img src={cake} style={{height: "5rem", width: "5rem", marginTop: "2rem"}} alt={"cake"}/>
                <div style={{display: "flex", gap: '2rem', marginTop: '2rem', justifyContent: "center",backgroundColor:"white"}}>
                    <input placeholder='DD' value={day} onChange={(event) => {
                        const onlyNums = event.target.value.replace(/\D/g, '');
                        setDay(onlyNums)
                    }} maxLength={2} style={{
                        height: "2rem",
                        width: "3rem",
                        outline: "none",
                        padding: "0.5rem",
                        borderRadius: '0.5rem',
                        color:'black',
                        border:0,
                        fontWeight:"bold",
                        fontSize:"1.5rem",
                        backgroundColor:"white",
                    }}/>

                    <input placeholder='MM' value={month} onChange={(event) => {
                        const onlyNums = event.target.value.replace(/\D/g, '');
                        setMonth(onlyNums)
                    }} maxLength={2} style={{
                        height: "2rem",
                        width: "3rem",
                        outline: "none",
                        padding: "0.5rem",
                        borderRadius: '0.5rem',
                        color:'black',
                        border:0,
                        fontWeight:"bold",
                        fontSize:"1.5rem",
                        backgroundColor:"white",


                    }}/>

                    <input placeholder='YYYY' value={year} onChange={(event) => {
                        const onlyNums = event.target.value.replace(/\D/g, '');
                        setYear(onlyNums)
                    }} maxLength={4} style={{
                        height: "2rem",
                        width: "4rem",
                        outline: "none",
                        padding: "0.5rem",
                        border:0,
                        borderRadius: '0.5rem',
                        color:'black',
                        fontWeight:"bold",
                        fontSize:"1.5rem",
                        backgroundColor:"white",

                    }}/>
                </div>
            </div>

            <div style={{position: "absolute", bottom: "5rem"}}>
                {
                    loading ? <Loader color={"red"} loading={loading} /> :  <MainButton title={t('continue_button')} color={'white'} onClick={() => {
                        if (day != '' && month != '' && year != '') fetchData()
                        else toast.error('Please enter DOB correctly');

                    }}/>
                }
            </div>

        </div>

    )
}

export default BirthdayScreen;
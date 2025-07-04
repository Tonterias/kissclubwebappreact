import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {auth, db} from "../../services/firebaseConfig.tsx";
import {doc, updateDoc} from "firebase/firestore";
import ProgressBar from "../../components/ProgressBar.tsx";
import Text from "../../components/customText.tsx";
import  {TextInputName} from "../../components/TextInputs.tsx";
import {MainButton} from "../../components/Buttons.tsx";
import '../../styles/auth.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {toast} from "react-toastify";
import Loader from "../../components/loader.tsx";

const NameScreen = () => {
    const {t} = useTranslation();
    const [name, setName] = useState<string>('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        const user = auth.currentUser;
        setLoading(true);
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            try {
                await updateDoc(userRef, {
                    nickName: name
                });
                navigate('/birthday')
                setLoading(false);
            } catch (error) {
                console.error('Error updating name:', error);
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
                <ProgressBar width={"20vw"}/>
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
                    text={t('kiss_club_identity')}
                />
                <Text
                    color="black"
                    size="1rem"
                    fontWeight="normal"
                    text={t('nickname_info')}
                    className="text-align"
                />
            </div>

            <div style={{width: '90vw', position: 'relative', justifyContent: 'center', alignItems: 'center'}}>
                <TextInputName type={'text'} placeholder={t('nickname')} icon={''} onChange={(text) => {
                    setName(text.target.value);
                }} value={name} label={''}/>
            </div>

            <div style={{position: "absolute", bottom: "5rem"}}>
                {
                    loading ? <Loader loading={loading} color={"red"}/> :
                        <MainButton title={t('continue_button')} color={'white'} onClick={() => {
                            if (name != '' && name.length > 3)
                                fetchData()
                            else toast.error('Please enter name greater than 3 characters');
                        }}/>
                }
            </div>

        </div>

    )
}

export default NameScreen;
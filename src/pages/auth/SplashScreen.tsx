import logo from '../../assets/images/kiss_club.png'
import CommonLoader from "../../components/loader";
import {useTranslation} from "react-i18next";
import {useEffect} from "react";
import {auth, db} from "../../services/firebaseConfig.tsx";
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {useNavigate} from "react-router-dom";


const SplashScreen = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const user = auth.currentUser;

            if (user) {
                const emailVerified = user.emailVerified;

                if (emailVerified) {
                    const userDocRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(userDocRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();

                        if (data.isNewUser) return navigate('/phone');
                        if (!data.number) return navigate('/phone');
                        if (!data.nickName) return navigate('/name');
                        if (!data.day || !data.month || !data.year) return navigate('/birthday');
                        if (!data.gender) return navigate('/gender');
                        if (!Array.isArray(data.whoWantToMeet)) return navigate('/options');
                        if (!data.relationShipGoal) return navigate('/goals');
                        if (!data.partyId) return navigate('/party');

                        return navigate('/swipe');
                    } else {
                        // User does not exist → create entry
                        await setDoc(userDocRef, {
                            day: "",
                            gender: "",
                            id: user.uid,
                            isNewUser: true,
                            month: "",
                            nickName: "",
                            number: "",
                            partyId: "",
                            relationShipGoal: "",
                            whoWantToMeet: [],
                            year: "",
                            blockedUsers: []
                        });

                        return navigate('/phone');
                    }
                } else {
                    return navigate('/verification');
                }
            } else {
                return navigate('/welcome');
            }
        };

        checkUser();
    }, []);


    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                flexDirection: 'column',
                gap: '30vh',
            }}
        >
            <div>
                <img src={logo} alt="Kiss club logo" style={{height: "5rem", width: "10rem"}}/>
                <p style={{
                    fontFamily: "Poppins",
                    fontWeight: "bold",
                    fontSize: "2rem",
                    color: "red"
                }}>{t('app_name')}</p>
            </div>

            <div>
                <CommonLoader loading={true} color={"red"}/>
            </div>

        </div>
    );
};

export default SplashScreen;

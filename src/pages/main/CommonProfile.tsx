import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {db} from "../../services/firebaseConfig.tsx";
import {doc, getDoc, onSnapshot} from "firebase/firestore";
import Male from '../../assets/images/male.png';
import Female from '../../assets/images/female.png';
import {faArrowLeft, faEllipsisV} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate, useParams} from "react-router-dom";
import Loader from "../../components/loader.tsx";
import OptionsDialogue from "../../components/OptionsDialogue.tsx";
import BlockDialogue from "../../components/BlockDialogue.tsx";

const CommonProfile = () => {
    const {id} = useParams();
    const {t} = useTranslation();
    const [profileData, setProfileData] = useState<any>(null);
    const [profile, setProfile] = useState<string>('');
    const [age, setAge] = useState<number>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [openOptions, setOpenOptions] = useState(false);
    const [blockDialogue, setBlockDialogue] = useState<boolean>(false);
    const getAgeFromDOB = (dob: { day: number; month: number; year: number }) => {
        const today = new Date();
        const birthDate = new Date(dob.year, dob.month - 1, dob.day);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        setAge(age);
    };
    useEffect(() => {
        setLoading(true);
        if (id==null) return ;
        const unsubscribe = onSnapshot(doc(db, "users", id), async (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setProfileData(data);
                // Calculate age
                const day = parseInt(data.day, 10);
                const month = parseInt(data.month, 10);
                const year = parseInt(data.year, 10);
                if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                    getAgeFromDOB({day, month, year});
                }
                if (data.partyId) {
                    GetProfilePic(data.partyId);
                }

                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [id]);

    const GetProfilePic = async (partyId: string) => {
        if (!partyId || !id) return;

        try {
            const userDocRef = doc(db, "parties", partyId, "usersData", id);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();

                if (userData?.profilePic) {
                    setProfile(userData.profilePic);
                } else {
                    setProfile("");
                }
            } else {
            }
        } catch (error) {
            console.error("Error fetching profile picture:", error);
        }
    };



    // @ts-ignore
    // @ts-ignore
    return (
        <div style={{height: '100vh', width: '100vw', backgroundColor: 'white'}}>
            <div style={{position: 'absolute', top: 30, left: 15}} className="forgot-password-btn"
                 onClick={() => navigate(-1)}>
                <FontAwesomeIcon icon={faArrowLeft} size="2x" color={"black"}/>
            </div>
            <div style={{
                position: 'absolute',
                top: 30,
                right: 25,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }} className="forgot-password-btn"
                 onClick={()=>setOpenOptions(!openOptions)}
            >
                <FontAwesomeIcon icon={faEllipsisV} color={"black"} style={{height: "1.5rem", width: "1.5rem"}}/>
            </div>

            {
                openOptions ?<div style={{position: "absolute", top: "4rem", right: 25}}>
                    <OptionsDialogue onClick={() => {
                        setBlockDialogue(true);
                        setOpenOptions(false)
                    }}/>
                </div>:null
            }

            {
                blockDialogue ? <BlockDialogue onClick={()=>{setBlockDialogue(false)}} navigate={()=>{
                    navigate(-1);
                }} userId={id}/> : null
            }

            {
                loading ?
                    <div style={{
                        height: '100vh',
                        width: '100vw',
                        backgroundColor: 'white',
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Loader loading={loading} color={"red"}/>
                    </div>
                    : <div style={{
                        height: "100%",
                        width: '100%',
                        backgroundColor: 'white',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: "2rem"
                    }}>
                        <div style={{
                            backgroundColor: "#f5f3f3",
                            height: "40%",
                            width: "90%",
                            borderRadius: "2rem"
                        }}>
                            {profile && (
                                <img
                                    src={profile}
                                    alt="Profile"
                                    style={{width: "100%", height: "100%", borderRadius: "2rem", objectFit: "contain"}}
                                />
                            )}
                        </div>

                        <div style={{
                            color: "black",
                            fontFamily: "Poppins",
                            width: "90vw",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                            borderBottom: "1px solid grey",
                            paddingBottom: "0.5rem"
                        }}>
                            <p style={{
                                fontSize: "1.2rem",
                                fontWeight: "700"
                            }}>{profileData?.nickName.toUpperCase()} ({age})</p>
                            <div style={{
                                color: "black",
                                fontFamily: "Poppins",
                                width: "90vw",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "start",
                                alignItems: "center"
                            }}>
                                <img
                                    src={profileData?.gender === 'FEMALE' ? Female : Male}
                                    style={{height: "1rem", width: "1rem", marginRight: '0.5rem'}}
                                    alt={"gender"}
                                />
                                <p style={{ fontWeight: "500" }}>
                                    {profileData?.gender == 'MALE'
                                        ? t('man')
                                        : profileData?.gender == 'FEMALE'
                                            ? t('woman')
                                            : t('other')}
                                </p>                            </div>

                        </div>

                        <div style={{
                            color: "black",
                            fontFamily: "Poppins",
                            width: "90vw",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start"
                        }}>
                            <p style={{fontSize: "1.2rem", fontWeight: "700"}}>{t('relationship_goal')}</p>
                            <div style={{
                                color: "black",
                                fontFamily: "Poppins",
                                display: "flex",
                                border: "1px solid grey",
                                borderRadius: "1rem",
                                padding: "0.2rem"
                            }}>
                                <p>{profileData?.relationShipGoal == 'DATING' ? t('dating') : profileData?.relationShipGoal == 'CASUAL'?t('casual') : profileData?.relationShipGoal == 'FRIENDSHIP' ? t('friendship'): profileData?.relationShipGoal == 'SERIOUS_RELATIONSHIP' ? t('serious_relationship'):null}</p>
                            </div>
                        </div>
                    </div>
            }
        </div>
    );
}

export default CommonProfile;

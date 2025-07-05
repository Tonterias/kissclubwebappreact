import BottomNav from "../../components/tabNavigation.tsx";
import UpperNav from "../../components/UpperNav.tsx";
import {useTranslation} from "react-i18next";
import {useCallback, useEffect, useState} from "react";
import {auth, db} from "../../services/firebaseConfig.tsx";
import {arrayRemove, doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import Male from '../../assets/images/male.png';
import Female from '../../assets/images/female.png';
import {faPen} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import Loader from "../../components/loader.tsx";
import MatchesUserPopup from "../../components/MatchesUserPopup.tsx";

const ProfileScreen = () => {
    const {t} = useTranslation();
    const [profileData, setProfileData] = useState<any>(null);
    const [profile, setProfile] = useState<string>('');
    const [age, setAge] = useState<number>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [newMatches, setNewMatches] = useState<{ id: string; profilePic: string ,myProfile:string}[]>([]);
    const [showUserDialog, setShowUserDialog] = useState(false);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [party, setParty] = useState("");

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
        const user = auth.currentUser;
        if (!user) return;
        const unsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                if (!data.partyId) return ;
                setParty(data.partyId);
                setProfileData(data);
                const day = parseInt(data.day, 10);
                const month = parseInt(data.month, 10);
                const year = parseInt(data.year, 10);
                getAgeFromDOB({day, month, year});
                setLoading(false);

            }
        });

        return () => unsubscribe();
    }, []);
    useEffect(() => {
        setLoading(true);
        const user = auth.currentUser;
        if (!user || !profileData?.partyId) return;

        const userDocRef = doc(db, "parties", profileData.partyId, "usersData", user.uid);
        const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setProfile(data.profilePic);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [profileData?.partyId]);


    const GetMatchesUsers = useCallback(async () => {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const data = userDoc.data();
            const partyId = data.partyId;
            const userRef = doc(db, 'parties', partyId, 'usersData', user.uid);

            onSnapshot(userRef, async (userSnapshot) => {
                const data = userSnapshot.data();
                // @ts-ignore
                const matchList: string[] = data.newMatchList || [];

                const detailsArray = await Promise.all(
                    matchList.map(async (id) => {
                        setShowUserDialog(true);
                        const myDocRef = doc(db, "parties", partyId, "usersData", user.uid);
                        const userRef = doc(db, 'parties', partyId, "usersData", id);
                        const userDoc = await getDoc(userRef);
                        const myDoc = await getDoc(myDocRef);
                        if (!userDoc.exists() && !myDoc.exists()) return null;

                        const userData = userDoc.data();
                        const myData = myDoc.data();
                        // @ts-ignore
                        const profilePic = userData.profilePic || '';
                        // @ts-ignore
                        const myProfile = myData.profilePic || ''
                        return {
                            id,
                            profilePic,
                            myProfile,
                        };
                    })
                );
                const filteredDetails = detailsArray.filter(Boolean) as { id: string; profilePic: string }[];
                if (filteredDetails.length > 0) {
                    // @ts-ignore
                    setNewMatches(filteredDetails);
                    setCurrentMatchIndex(0);
                    setShowUserDialog(true);
                }
            });
        }
    }, []);

    useEffect(() => {
        GetMatchesUsers();
    }, [GetMatchesUsers]);
    const handleNextMatch = () => {
        if (currentMatchIndex + 1 < newMatches.length) {
            setCurrentMatchIndex(currentMatchIndex + 1);
        } else {
            setShowUserDialog(false);
        }
    };

    const removeNewMatchMessage = async (matchId: string) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            // Step 1: Get partyId from 'users' collection
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (!userDocSnap.exists()) return;

            const partyId = userDocSnap.data().partyId;
            if (!partyId) return;

            // Step 2: Remove matchId from newMatchList in 'parties' collection
            const partyUserDocRef = doc(db, "parties", partyId, "usersData", user.uid);
            await updateDoc(partyUserDocRef, {
                newMatchList: arrayRemove(matchId),
            });

        } catch (error) {
            console.error("Error removing matchId from newMatchList:", error);
        }
    };


    // @ts-ignore
    return (
        <div style={{height: '100vh', width: '100vw', backgroundColor: 'white'}}>
            <UpperNav label={t('profile')}/>
            {showUserDialog && newMatches[currentMatchIndex] ? (
                <div style={{
                    height: '100vh',
                    width: '100vw',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: "absolute",
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 10000,
                }}>
                    <MatchesUserPopup
                        userId={newMatches[currentMatchIndex].id}
                        profileOne={newMatches[currentMatchIndex].myProfile}
                        profileTwo={newMatches[currentMatchIndex].profilePic}
                        onClick={async ()=>{
                            await  removeNewMatchMessage(newMatches[currentMatchIndex].id);
                            handleNextMatch();
                        }}
                        partyId={party}
                    />
                </div>
            ) : null}
            {
                loading ?
                    <div style={{height:'100vh',width:'100vw', backgroundColor: 'white',display:"flex",justifyContent:"center",alignItems:"center"}}>
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
                        <p style={{fontSize: "1.2rem", fontWeight: "700"}}>{profileData?.nickName.toUpperCase()} ({age})</p>
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
                            </p>
                        </div>

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
                    <div style={{
                        position: "fixed",
                        right: "2rem",
                        bottom: "7rem",
                        backgroundColor: "red",
                        height: "2rem",
                        width: "2rem",
                        padding: "0.5rem",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems:"center",
                        cursor: 'pointer'
                    }}
                         className={"forgot-password-btn"}
                         onClick={()=>{
                             navigate('/edit');
                         }}
                    >
                        <FontAwesomeIcon icon={faPen} style={{}} color={"white"}/>
                    </div>
                </div>
            }
            <BottomNav/>
        </div>
    );
}

export default ProfileScreen;

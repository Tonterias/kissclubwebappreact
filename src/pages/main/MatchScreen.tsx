import BottomNav from "../../components/tabNavigation.tsx";
import UpperNav from "../../components/UpperNav.tsx";
import {useTranslation} from "react-i18next";
import {useEffect, useState, useRef, useCallback} from "react";
import {auth, db} from "../../services/firebaseConfig.tsx";
import {arrayRemove, doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import Loader from "../../components/loader.tsx";
import {useNavigate} from "react-router-dom";
import NotFound from "../../assets/images/notFound.png";
import MatchesUserPopup from "../../components/MatchesUserPopup.tsx";

const MatchesScreen = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [likedUsersData, setLikedUsersData] = useState<any[]>([]);
    const [profilePics, setProfilePics] = useState<{ [id: string]: string }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const fetchedUserCache = useRef<Set<string>>(new Set());
    const activeListeners =useRef<Map<string, () => void>>(new Map());
    const [newMatches, setNewMatches] = useState<{ id: string; profilePic: string ,myProfile:string}[]>([]);
    const [showUserDialog, setShowUserDialog] = useState(false);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [party, setParty] = useState("");

    const getAgeFromDOB = ({day, month, year}: { day: number; month: number; year: number }) => {
        const today = new Date();
        const birthDate = new Date(year, month - 1, day);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    const fetchLikedUsersData = async (likes: string[], partyId: string) => {
        const newUserData: any[] = [];
        const newProfilePics: { [id: string]: string } = {};

        const promises = likes.map(async (likeId) => {
            if (fetchedUserCache.current.has(likeId)) return;

            // Fetch user document (basic info)
            const userSnap = await getDoc(doc(db, "users", likeId));
            if (userSnap.exists()) {
                const userData = userSnap.data();
                const day = parseInt(userData.day, 10);
                const month = parseInt(userData.month, 10);
                const year = parseInt(userData.year, 10);

                newUserData.push({
                    id: likeId,
                    name: userData.nickName,
                    day,
                    month,
                    year,
                    age: getAgeFromDOB({day, month, year}),
                });

                fetchedUserCache.current.add(likeId);
            }

            // Fetch profile pic
            const partySnap = await getDoc(doc(db, "parties", partyId, "usersData", likeId));
            if (partySnap.exists()) {
                const partyData = partySnap.data();
                newProfilePics[likeId] = partyData.profilePic || "";
            }
        });

        await Promise.all(promises);

        setLikedUsersData((prev) => [...prev, ...newUserData]);
        setProfilePics((prev) => ({...prev, ...newProfilePics}));
    };

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const unsubscribeUser = onSnapshot(userRef, (userSnap) => {
            if (userSnap.exists()) {
                const userData = userSnap.data();
                if (!userData.partyId) return ;
                setParty(userData.partyId);
                const partyRef = doc(db, "parties", userData.partyId, "usersData", user.uid);

                const unsubscribeParty = onSnapshot(partyRef, async (partySnap) => {
                    if (partySnap.exists()) {
                        const matchesArr: string[] = partySnap.data().matches || [];

                        matchesArr.forEach((match) => {
                            if (activeListeners.current.has(match)) {
                                return;
                            }


                            const likedUserRef = doc(db, "users", match);
                            const unsubscribeLikedUser = onSnapshot(likedUserRef, async (snap) => {
                                if (!snap.exists()) {
                                    return;
                                }

                                const likedUserData = snap.data();
                                const blocked = likedUserData.blockedUsers || [];
                                const currentUserId = user.uid;

                                if (!blocked.includes(currentUserId) && !fetchedUserCache.current.has(match)) {
                                    await fetchLikedUsersData([match], likedUserData.partyId);
                                    fetchedUserCache.current.add(match);
                                }

                            });

                            activeListeners.current.set(match, unsubscribeLikedUser);
                        });

                        setLoading(false);
                    }
                });

                // Cleanup party listener on unmount
                return () => {
                    unsubscribeParty();
                };
            }
        });

        // Global cleanup on effect cleanup
        return () => {
            unsubscribeUser();
            // Clean up all liked user listeners
            activeListeners.current.forEach((unsub) => unsub());
            activeListeners.current.clear();
        };
    }, []);


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


    return (
        <div style={{height: "100vh", width: "100vw", backgroundColor: "white"}}>
            <UpperNav label={t("matches")}/>
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
            <div
                style={{
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    position: "relative",
                    top: 100,
                    alignItems: "center",
                    flexDirection: "column",
                    overflowY: "scroll",
                }}
            >

                {
                    likedUsersData.length === 0 ?
                        <div style={{
                            height: "100vh",
                            width: "100vw",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            flexDirection: "column",
                            color:"black"
                        }}>
                            <img src={NotFound} alt={"not_found"} style={{
                                height:"14rem",
                                width: "14rem",
                            }}/>
                            <p style={{fontFamily:"Poppins",fontSize:"1.5rem"}}>{t('no_likes')}</p>
                        </div>:null

                }
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "start",
                        flexWrap: "wrap",
                        width: "100vw",
                        paddingTop: "3vh",
                        paddingBottom: "18vh",
                        gap: "1rem",
                    }}
                >
                    {loading ? (
                        <div style={{
                            height: "100vh",
                            width: "100vw",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <Loader loading={loading} color={"#FF0000"}/>
                        </div>
                    ) : (
                        likedUsersData.map((user) => (
                            <div
                                key={user.id}
                                style={{
                                    width: "40%",
                                    height: "15rem",
                                    borderRadius: "0.5rem",
                                    backgroundColor: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                    color: "white",
                                    padding: "1rem",
                                }}
                                onClick={() =>
                                    navigate(`/common/${user.id}`)
                            }
                            >
                                {profilePics[user.id] && (
                                    <img
                                        src={profilePics[user.id]}
                                        alt="profile"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderTopLeftRadius: "1rem",
                                            borderTopRightRadius: "1rem",
                                            boxShadow: "1px 1px 1px rgba(0,0,0,0.5)",

                                        }}
                                    />

                                )}
                                <div
                                    style={{
                                        position: "relative",
                                        zIndex: 999,
                                        backgroundColor: "black",
                                        width: "100%",
                                        boxShadow: "1px 1px 1px rgba(0,0,0,0.5)",
                                        borderBottomLeftRadius: "1rem",
                                        borderBottomRightRadius: "1rem",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: "column",

                                    }}
                                >
                                    <p style={{fontWeight: "bold", margin: 0}}>{user.name}</p>
                                    <p style={{margin: 0}}>{user.age}</p>
                                </div>

                            </div>
                        ))
                    )}
                </div>
            </div>

            <BottomNav/>
        </div>
    );
};

export default MatchesScreen;

import BottomNav from "../../components/tabNavigation.tsx";
import UpperNav from "../../components/UpperNav.tsx";
import {useTranslation} from "react-i18next";
import CustomCardSwipe from "../../components/CustomCardSwipe.tsx";
import {useEffect, useState, useCallback, useRef} from "react";
import {auth, db} from "../../services/firebaseConfig.tsx";
import {arrayRemove, collection, doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import Loader from "../../components/loader.tsx";
import {
    LikedUsersLogic,
    ViewedLogic
} from "../../components/LikedUsersLogic.tsx";
import {useNavigate} from "react-router-dom";
import MatchesUserPopup from "../../components/MatchesUserPopup.tsx";


type CardsData = {
    id: string;
    image: string;
    name: string;
}
type Cards = CardsData [];
const SwipeScreen = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [party, setParty] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_myBlockedUsers, setMyBlockedUsers] = useState([]);
    const [cards, setCards] = useState<Cards>([]);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_meet, setMeet] = useState("");
    const [newMatches, setNewMatches] = useState<{ id: string; profilePic: string ,myProfile:string}[]>([]);
    const [showUserDialog, setShowUserDialog] = useState(false);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const unsubscribes = useRef<(() => void)[]>([]);

    const cleanupListeners = useCallback(() => {
        unsubscribes.current.forEach(unsubscribe => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });
        unsubscribes.current = [];
    }, []);


    // Main data loading function with proper cleanup
    useEffect(() => {
        setLoading(true);
        const currentUser = auth.currentUser;
        if (!currentUser) {
            setLoading(false);
            return cleanupListeners;
        }

        // Single listener for current user data
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userUnsubscribe = onSnapshot(userDocRef, async (snapshot) => {
            const userData = snapshot.data();
            if (!userData) {
                setLoading(false);
                return;
            }

            const partyId = userData.partyId;
            const meetPreference = userData.whoWantToMeet?.[0] || 'ALL';

            setMeet(meetPreference);
            setParty(partyId);

            if (!partyId) {
                setLoading(false);
                return;
            }

            const blockedArr = userData.blockedUsers || [];
            setMyBlockedUsers(blockedArr);

            // Subscribe to users in the party
            const partyUsersRef = collection(db, 'parties', partyId, 'usersData');
            const partyUnsubscribe = onSnapshot(partyUsersRef, async (usersSnapshot) => {
                try {
                    //check the party is closed or open
                    const checkPartyRef = doc(db, 'parties', partyId);
                    const checkPartyDoc = await getDoc(checkPartyRef);
                    const data = checkPartyDoc.data();
                    // @ts-ignore
                    const partyStatus = data.partyStatus;
                    if (partyStatus == 'Closed' || partyStatus == 'closed') {
                        await updateDoc(userDocRef,{
                            partyId: '',
                        })
                        navigate('/party');
                        return;
                    }
                    // Get all party users
                    const partyUsersArr = usersSnapshot.docs.map(doc => doc.id);

                    // Get current user's party data
                    const currentUserPartyRef = doc(db, 'parties', partyId, 'usersData', currentUser.uid);
                    const currentUserPartySnap = await getDoc(currentUserPartyRef);
                    const currentUserPartyData = currentUserPartySnap.data() || {};

                    const likedUsers = currentUserPartyData.likedUser || [];
                    const viewedUsers = currentUserPartyData.viewedUser || [];

                    // Combined exclusion set
                    const excludedUsers = new Set([...likedUsers, ...viewedUsers, currentUser.uid, ...blockedArr]);

                    // Filter eligible users
                    const eligibleUsers = partyUsersArr.filter(userId => !excludedUsers.has(userId));

                    // Process eligible users to create cards
                    const userCards = [];

                    for (const userId of eligibleUsers) {
                        // Skip further checks if already excluded
                        if (userId === currentUser.uid) continue;

                        // Get user and party data in parallel
                        const [userSnap, partySnap] = await Promise.all([
                            getDoc(doc(db, 'users', userId)),
                            getDoc(doc(db, 'parties', partyId, 'usersData', userId))
                        ]);

                        if (userSnap.exists() && partySnap.exists()) {
                            const userData = userSnap.data();
                            const partyData = partySnap.data();

                            // Check if this user has blocked current user
                            const userBlockedList = userData.blockedUsers || [];
                            if (userBlockedList.includes(currentUser.uid)) continue;

                            const genderOfThisUser = userData.gender;

                            // Filter based on preference
                            const shouldInclude =
                                meetPreference === 'ALL' ||
                                genderOfThisUser === meetPreference;
                            if (shouldInclude) {
                                userCards.push({
                                    id: userId,
                                    name: userData.nickName,
                                    goal: userData.relationShipGoal,
                                    image: partyData.profilePic,
                                    gender: genderOfThisUser,
                                });
                            }
                        }
                    }

                    // @ts-ignore
                    setCards(userCards);
                    setLoading(false);
                } catch (error) {
                    console.error("Error processing users:", error);
                    setLoading(false);
                }
            });

            // @ts-ignore
            unsubscribes.current.push({fn: partyUnsubscribe, type: 'party'});
        });

        // @ts-ignore
        unsubscribes.current.push({fn: userUnsubscribe, type: 'user'});

        // Cleanup function
        return cleanupListeners;
    }, [cleanupListeners]);


    //

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
    // Handle card actions
    const handleLike = useCallback(async (cardId: string) => {
        setCards((prev) => prev.slice(1));
        await LikedUsersLogic(party, cardId);
    }, [party]);

    const handleSkip = useCallback(async (cardId: string) => {
        setCards((prev) => prev.slice(1));
        await ViewedLogic(party, cardId);
    }, [party]);
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
        <div
            style={{
                height: '100vh',
                width: '100vw',
                backgroundColor: 'white',
                color: 'black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            {loading ? (
                <div>
                    <Loader loading={loading} color={"#FF0000"}/>
                </div>
            ) : (
                <div
                    style={{
                        height: '100vh',
                        width: '100vw',
                        backgroundColor: 'white',
                        color: 'black',
                        display: 'flex',
                        justifyContent: 'center',
                        fontFamily: "Poppins",
                    }}
                >
                    <UpperNav label={t('swipes')}/>
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
                    {cards.map((card, index) => (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'white',
                            }}
                            key={card.id}

                        >
                            <CustomCardSwipe
                                data={card}
                                index={index}
                                removeCardRight={() => handleLike(card.id)}
                                isTopCard={index === 0}
                                removeCardLeft={() => handleSkip(card.id)}
                            />
                        </div>
                    ))}
                    {cards.length === 0 && (
                        <div style={{
                            height: '100vh',
                            width: '100vw',
                            backgroundColor: 'white',
                            color: 'red',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontFamily: "Poppins",
                        }}>
                            <p>{t('no_more_swipes')}</p>
                        </div>
                    )}
                    <BottomNav/>
                </div>
            )}

        </div>
    );
};

export default SwipeScreen;
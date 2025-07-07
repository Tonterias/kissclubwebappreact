import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useCallback, useEffect, useState} from "react";
import {analytics, auth, db} from "../../services/firebaseConfig.tsx";
import {arrayRemove, doc, getDoc, updateDoc} from "firebase/firestore";
import {logEvent} from "firebase/analytics";



type Props = {
    profilePic :string,
    name: string,
    blockedUserId:string,

}
const BlockedUsersPage = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [blockedDetail, setBlockedDetail] = useState<Props[]>([]);

    const GetBlockUser = useCallback(async () => {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const data = userDoc.data();
            const blockedUsers: string[] = data.blockedUsers || [];

            const detailsArray = await Promise.all(
                blockedUsers.map(async (blockedUserId) => {
                    const userRef = doc(db, 'users', blockedUserId);
                    const userDoc = await getDoc(userRef);

                    if (!userDoc.exists()) return null;

                    const userData = userDoc.data();
                    const name = userData.nickName || '';

                    let profilePic = '';
                    if (userData.partyId) {
                        const partyRef = doc(db, 'parties', userData.partyId, 'usersData', blockedUserId);
                        const partyDoc = await getDoc(partyRef);
                        if (partyDoc.exists()) {
                            const partyData = partyDoc.data();
                            profilePic = partyData.profilePic || '';
                        }
                    }

                    return {
                        name,
                        profilePic,
                        blockedUserId,
                    };
                })
            );

            const filteredDetails = detailsArray.filter(Boolean) as object[];
            // @ts-ignore
            setBlockedDetail(filteredDetails);
        }
    }, []);


    const unBlockedUsers = async (userId: string) => {
        const user = auth.currentUser;
        if (!user) return;
        const userRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        await updateDoc(userRef, {
            blockedUsers: arrayRemove(userId)
        })
        if (userData?.partyId) {
            logEvent(analytics, 'unblocked_user', {
                party_id: userData.partyId,
                reported_user_id: userId,
            });
        }

    }

    useEffect(() => {
        logEvent(analytics, 'screen_view', {
            firebase_screen: 'blocked_users_screen',
            firebase_screen_class: 'BlockedUsersPage',
        });
    }, []);
    useEffect(() => {
        GetBlockUser();
    }, [GetBlockUser, unBlockedUsers]);

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex', flexDirection: "column", alignItems: "center", textAlign: "start",
            color: 'black',
            fontFamily: "Poppins",
            justifyContent: "end",
        }}>
            <div
                style={{
                    position: 'relative',
                    left: 15,
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    width: "100vw"
                }}>
                <FontAwesomeIcon icon={faArrowLeft} size="2x" color={"black"} className="forgot-password-btn"
                                 onClick={() => navigate(-1)}/>
                <p style={{fontSize: "2rem", fontWeight: "600"}}>{t('blocked_users')}</p>
            </div>

            <div style={{
                height: '90%',
                width: '100vw',
                display: 'flex',
                flexDirection: "column",
                alignItems: "center",
                overflow: "scroll"
            }}>
                {
                    blockedDetail.length > 0 && blockedDetail.map((blockedUser) => {
                        return (
                            <div style={{
                                height: '10rem',
                                width: '90vw',
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "space-evenly",
                                boxShadow: "0px 0px 2px #000000",
                                borderRadius: "0.5rem",
                                marginTop: "0.5rem",
                            }}>
                                <div>
                                    <img src={blockedUser.profilePic} alt={"image"} style={{
                                        height: "8rem",
                                        width: "8rem",
                                    }}/>
                                </div>

                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <p>{blockedUser.name}</p>
                                    <div style={{
                                        backgroundColor: "white",
                                        borderRadius: "2rem",
                                        padding: "0.5rem",
                                        width: '100%',
                                        border: "1px solid red",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }} className="MainButton"
                                         onClick={async () => {
                                             await unBlockedUsers(blockedUser.blockedUserId);
                                         }}
                                    >
                                        <p style={{
                                            fontFamily: "Poppins",
                                            color: "red",
                                            fontWeight: "normal"
                                        }}>{t('unblock')}</p>
                                    </div>
                                </div>

                            </div>
                        )
                    })
                }


                {
                    blockedDetail.length === 0 ? <div style={{
                        height: '100%',
                        width: '100vw',
                        color: 'red',
                        display: 'flex',
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <p>
                            {t('no_blocked_user_found')}
                        </p>
                    </div> : null
                }
            </div>

        </div>
    )
}

export default BlockedUsersPage;
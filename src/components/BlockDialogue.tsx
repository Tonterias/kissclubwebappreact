import {useTranslation} from "react-i18next";
import Cross from '../assets/images/cross.png';
import Silent from '../assets/images/silent.png';
import {analytics, auth, db} from "../services/firebaseConfig.tsx";
import {arrayUnion, doc, getDoc, updateDoc, arrayRemove} from "firebase/firestore";
import {logEvent} from "firebase/analytics";

type Props = {
    onClick: () => void,
    userId: string | any,
    navigate: () => void
}

interface Datatyepe{
    partyId :string,
}
const BlockDialogue = ({onClick, userId, navigate}: Props) => {
    const {t} = useTranslation();

    const Blockuser = async () => {
        const user = auth.currentUser;
        if (!user) return;
        const usersRef = doc(db, "users", user.uid);
        await updateDoc(usersRef, {
            blockedUsers: arrayUnion(userId)
        })
        const userDocs = await getDoc(usersRef);
        if (userDocs.exists()) {
            const data = userDocs.data() as  Datatyepe;
            if (!data?.partyId) {
                console.error("partyId is missing in user data");
                return;
            }
            const partiesRef = doc(db, "parties", data.partyId, "usersData", user.uid);
            await updateDoc(partiesRef, {
                likedUser: arrayRemove(userId),
                matches: arrayRemove(userId),
                newMatchList: arrayRemove(userId),
                viewedUser: arrayRemove(userId),
            })

            const partiesRefAnother = doc(db, "parties", data.partyId, "usersData", userId);
            await updateDoc(partiesRefAnother, {
                likedUser: arrayRemove(user.uid),
                matches: arrayRemove(user.uid),
                newMatchList: arrayRemove(user.uid),
                viewedUser: arrayRemove(user.uid),
            })

            logEvent(analytics, 'blocked_user', {
                party_id: data.partyId,
                reported_user_id: userId,
            });
        }
    }


    return (
        <div style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
            position: "relative",
        }}>
            <div style={{
                height: "50%",
                width: "100%",
                backgroundColor: "white",
                borderTopRightRadius: "3rem",
                borderTopLeftRadius: "3rem",
                boxShadow: "0px 0px 2px #000000",
                position: "absolute",
                bottom: "0",
                color: "black",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
            >

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100vw",
                    fontFamily: "Poppins",
                    marginTop: "2rem",
                    backgroundColor: "white",
                    padding: "2rem",
                    borderColor: "grey"
                }}>
                    <p style={{fontWeight: "600", fontSize: "1.2rem"}}>{t('do_you_want_to_block_the_user')}</p>
                </div>

                <div style={{
                    height: "60%",
                    width: "90%",
                    borderTop: "0.5px solid grey",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    fontFamily: "Poppins",
                }}>
                    <div style={{
                        display: "flex",
                        gap: "1rem",
                        justifyContent: "start",
                        width: "100%",
                        marginTop: "2rem",
                        textAlign: "start",
                        alignItems: "center"
                    }}>
                        <img src={Cross} alt={"cross"} style={{height: "1.5rem", width: "1.5rem"}}/>
                        <p>{t('not_informed_message')}</p>
                    </div>

                    <div style={{
                        display: "flex",
                        gap: "1rem",
                        justifyContent: "start",
                        width: "100%",
                        marginTop: "2rem",
                        textAlign: "start",
                        alignItems: "center"
                    }}>
                        <img src={Silent} alt={"cross"} style={{height: "1.5rem", width: "1.5rem"}}/>
                        <p>{t('cannot_find_profile_message')}</p>
                    </div>

                </div>

                <div style={{
                    height: "30%",
                    width: "100vw",
                    display: "flex",
                    flexDirection: "row",
                    gap: "1rem",
                    justifyContent: "center",
                }}>
                    <div style={{
                        width: "40vw"
                    }}>
                        <div style={{
                            backgroundColor: "white",
                            padding: '0.9rem',
                            borderRadius: "2rem",
                            width: '30vw',
                            border: "1px solid red"
                        }} className="MainButton"
                             onClick={() => {
                                 console.log("triggered")
                                 onClick()

                             }}
                        >
                            <p style={{fontFamily: "Poppins", color: "black", fontWeight: "normal"}}>{t('cancel')}</p>
                        </div>
                    </div>
                    <div style={{
                        width: "40vw"
                    }}>
                        <div
                            style={{backgroundColor: "#FF0000", padding: '0.9rem', borderRadius: "2rem", width: '30vw'}}
                            className="MainButton"
                            onClick={async () => {
                                await Blockuser();
                                navigate()
                            }}
                        >
                            <p style={{
                                fontFamily: "Poppins",
                                color: "white",
                                fontWeight: "bold",
                                textAlign: "center"
                            }}>{t('block')}</p>
                        </div>
                    </div>

                </div>

            </div>


        </div>
    )
}

export default BlockDialogue;
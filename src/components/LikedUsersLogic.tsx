import {auth, db} from "../services/firebaseConfig.tsx";
import {arrayUnion, doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";

export const LikedUsersLogic = async (partyId: string, userId: string) => {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const currentUserRef = doc(db, 'parties', partyId, 'usersData', currentUser.uid);

        // Step 1: Add userId to likedUser and viewedUser
        await updateDoc(currentUserRef, {
            likedUser: arrayUnion(userId),
            viewedUser: arrayUnion(userId),
        });

        // Step 2: Check if the liked user has already liked current user
        const likedUserRef = doc(db, 'parties', partyId, 'usersData', userId);
        const likedUserSnap = await getDoc(likedUserRef);

        if (likedUserSnap.exists()) {
            const likedUserData = likedUserSnap.data();
            const likedUserLikes = likedUserData.likedUser || [];

            if (likedUserLikes.includes(currentUser.uid)) {
                // ✅ It's a mutual match!
                await updateDoc(currentUserRef, {
                    matches: arrayUnion(userId),
                    newMatchList: arrayUnion(userId),
                });

                await updateDoc(likedUserRef, {
                    matches: arrayUnion(currentUser.uid),
                    newMatchList: arrayUnion(currentUser.uid),
                });
            }
        }

    } catch (error) {
        console.error("❌ Error in LikedUsersLogic:", error);
    }
};



export  const ViewedLogic = async (partyId:string,userId:string) => {
    try {
        const user = auth.currentUser;
        if (!user) return;
        const partyRef = doc(db,'parties',partyId,'usersData',user.uid);
        onSnapshot(partyRef,(snapshot)=>{
            const data = snapshot.data();
            if (!data) return;
            updateDoc(partyRef, {
                viewedUser: arrayUnion(userId),
            }).then(() => {
                console.log("UserUpdated");
            }).catch((e) => {
                console.error("error", e);
            })
        })
    }catch (e) {
        console.log(e);
    }
}


export const SyncMatches = async (partyId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "parties", partyId, "usersData", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const likedUsers: string[] = userData.likedUser || [];
    const currentMatches: string[] = userData.matches || [];
    const newMatchList: string[] = userData.newMatchList || [];

    for (const likedUserId of likedUsers) {
        if (currentMatches.includes(likedUserId)) {
            // Already matched, no action needed
            continue;
        }

        // Check if likedUser liked current user back
        const likedUserRef = doc(db, "parties", partyId, "usersData", likedUserId);
        const likedUserSnap = await getDoc(likedUserRef);
        if (!likedUserSnap.exists()) continue;

        const likedUserData = likedUserSnap.data();
        const likedUserLikes: string[] = likedUserData.likedUser || [];

        if (likedUserLikes.includes(user.uid)) {
            // Mutual match detected!

            // Add to 'matches' array (confirmed matches)
            await updateDoc(userRef, {
                matches: arrayUnion(likedUserId),
            });

            // Add to 'newMatchList' ONLY if NOT already there
            if (!newMatchList.includes(likedUserId)) {
                await updateDoc(userRef, {
                    newMatchList: arrayUnion(likedUserId),
                });
            }
        }
    }
};

// Call this function somewhere on app startup or at regular intervals

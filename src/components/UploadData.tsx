import {doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import {auth, db} from "../services/firebaseConfig.tsx";


export const uploadData =async (url:string,partyId:string)=>{
    try {
        const user = auth.currentUser;
        if (!user) console.log("No user found");
        if (user) {
            const  userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                partyId:partyId
            });

            const partyUserRef = doc(db, "parties", partyId, "usersData", user.uid);
            const docs = await getDoc(partyUserRef);
            if (docs.exists()) {
                console.log('Found', docs.exists());
            }
            else {
                await setDoc(partyUserRef, {
                    likedUser :[],
                    matches :[],
                    newMatchList:[],
                    profilePic:url,
                    userId:user.uid,
                    viewedUser:[]
                });
            }
        }
    }catch (error) {
        console.log(error);
    }
}
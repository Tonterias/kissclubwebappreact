import {auth, provider} from "./firebaseConfig.tsx";
import { signInWithPopup } from "firebase/auth";

export const SignInWithGoogle = async () => {
    try{
        const result = await signInWithPopup(auth,provider);
        const user = result.user;
        return user;
    }catch(e){
        console.error(e);
    }
}
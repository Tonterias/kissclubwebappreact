import UpperNav from "../../components/UpperNav.tsx";
import {useTranslation} from "react-i18next";
import BottomNav from "../../components/tabNavigation.tsx";
import {useEffect, useRef, useState} from "react";
import {auth, db, storage} from "../../services/firebaseConfig.tsx";
import {doc, onSnapshot, updateDoc} from "firebase/firestore";
import {faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {TextInputNew} from "../../components/TextInputs.tsx";
import Dropdown from "../../components/Dropdown.tsx";
import {useNavigate} from "react-router-dom";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import Loader from "../../components/loader.tsx";


const EditScreen = () => {
    const {t} = useTranslation();
    const [profileData, setProfileData] = useState<any>(null);
    const [profile, setProfile] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [gender, setGender] = useState('');
    const [goal, setGoal] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState('');
    const [partyId, setPartyId] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true)
        const user = auth.currentUser;
        if (!user) return;
        const unsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setProfileData(data);
                setName(data.nickName)
                setGender(data.gender)
                setGoal(data.relationShipGoal)
                setPartyId(data.partyId)
                setLoading(false)
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        setLoading(true)
        const user = auth.currentUser;
        if (!user || !profileData?.partyId) return;

        const userDocRef = doc(db, "parties", profileData.partyId, "usersData", user.uid);
        const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setProfile(data.profilePic);
                setLoading(false)
            }
        });

        return () => unsubscribe();
    }, [profileData?.partyId]);

    const openFilePicker = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            // @ts-ignore
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            // @ts-ignore
            setPreviewUrl(objectUrl);
        }
    };
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    async function uploadFile(file: File | null): Promise<string | null> {
        if (!file) return null;

        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);

        const url = await getDownloadURL(storageRef);

        return url;
    }

    const handleUploadImage = async () => {
        if (!selectedFile) return;

        try {
            const user = auth.currentUser;
            if (!user) return;
            const url = await uploadFile(selectedFile);
            if (!partyId) return;
            const partyRef = doc(db, "parties", partyId, "usersData", user.uid);
            await updateDoc(partyRef, {
                profilePic: url,
            });
            navigate(-1);
        } catch (error) {
            console.error("Upload failed", error);
        }
    };
    const handleUploadData = async () => {
        try {
            const user = auth.currentUser;
            await handleUploadImage();
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                await updateDoc(userDocRef, {
                    nickName: name,
                    gender: gender,
                    relationShipGoal: goal,
                });

                navigate(-1);
            }
        } catch (e) {
        }
    };
    return (
        <div style={{height: '100vh', width: '100vw', backgroundColor: "white", color: "black", padding: "18vh 0px 30vh", overflowY: "scroll"}}>
            <UpperNav label={t('edit_profile')}/>
            {
                loading ? <div style={{
                    height: '100vh',
                    width: '100vw',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Loader loading={loading} color={"red"}/>
                </div> : <div style={{
                    height: "100vh",
                    width: '100vw',
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: "2rem"
                }}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{display: "none"}}
                        onChange={handleFileChange}
                        accept="image/*"
                    />

                    <div
                        style={{
                            backgroundColor: "white",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "2rem",
                            gap: "1rem",
                        }}
                    >
                        {profile || previewUrl ? (
                            <div style={{
                                position: 'relative',
                                display: "flex",
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    color="white"
                                    size="lg"
                                    style={{
                                        position: "absolute",
                                        backgroundColor: "red",
                                        borderRadius: "50%",
                                        padding: "0.5rem",
                                        zIndex: 10,
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        // @ts-ignore
                                        setPreviewUrl('');
                                        setProfile('');
                                    }}
                                />

                                {/* Image Preview */}
                                <img
                                    src={previewUrl || profile}
                                    alt="Profile"
                                    style={{
                                        position: 'relative',
                                        height: "25rem",
                                        objectFit: "cover",
                                        borderRadius: "1rem",
                                        cursor: "pointer",
                                        zIndex: 1,
                                        width: "90%",
                                        marginTop: "5rem",
                                    }}
                                    onClick={openFilePicker}
                                />
                            </div>
                        ) : (
                            <div
                                style={{
                                    width: "90vw",
                                    height: "25rem",
                                    borderRadius: "1rem",
                                    backgroundColor: "#eeeeee",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onClick={openFilePicker}
                            >
                                <FontAwesomeIcon icon={faPlus} color={"#aeaeae"} size={"2x"}/>
                            </div>
                        )}

                    </div>
                    <div>

                        <div style={{width: "80vw"}}>
                            <TextInputNew label={t('nickname')} type={"text"} placeholder={t('nickname')} icon={""}
                                          onChange={(text) => setName(text.target.value)} value={name}/>
                        </div>

                        <div style={{width: '90vw', display: "flex", flexDirection: "column", alignItems: "start"}}>
                            <p style={{fontFamily: "Poppins"}}>{t('gender')}</p>
                            <Dropdown
                                options={['MALE', 'FEMALE', 'OTHER']}
                                selected={gender}
                                onSelect={setGender}
                            />
                        </div>

                        <div style={{width: '90vw', display: "flex", flexDirection: "column", alignItems: "start"}}>
                            <p style={{fontFamily: "Poppins"}}>{t('relationship_goal')}</p>
                            <Dropdown
                                options={['DATING', 'SERIOUS_RELATIONSHIP', 'CASUAL', 'FRIENDSHIP']}
                                selected={goal}
                                onSelect={setGoal}
                            />
                        </div>


                    </div>
                    <div style={{
                        display: "flex",
                        marginTop: "2rem",
                        width: '90vw',
                        justifyContent: 'center',
                        gap: "2rem",
                    }}>

                        <div style={{
                            backgroundColor: "white",
                            padding: '0.9rem',
                            borderRadius: "2rem",
                            width: '40vw',
                            border: "1px solid red"
                        }} className="MainButton" onClick={() => navigate(-1)}>
                            <p style={{fontFamily: "Poppins", color: "blue", fontWeight: "normal"}}>{t('cancel')}</p>
                        </div>
                        <div
                            style={{backgroundColor: "#FF0000", padding: '0.9rem', borderRadius: "2rem", width: '40vw'}}
                            className="MainButton"
                            onClick={async () => {
                                await handleUploadData();
                            }}
                        >
                            <p style={{
                                fontFamily: "Poppins",
                                color: "white",
                                fontWeight: "bold",
                                textAlign: "center"
                            }}>{t('save')}</p>
                        </div>
                    </div>
                </div>
            }

            <BottomNav/>
        </div>
    )
}

export default EditScreen;
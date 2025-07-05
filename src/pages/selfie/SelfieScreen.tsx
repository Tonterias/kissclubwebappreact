import { useTranslation } from "react-i18next";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MainButton } from "../../components/Buttons.tsx";
import React, {useState, useRef, useEffect} from "react";
import { storage } from "../../services/firebaseConfig.tsx";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {useNavigate, useParams } from "react-router-dom";
import {uploadData} from "../../components/UploadData.tsx";
import Loader from "../../components/loader.tsx";


const SelfieScreen = () => {
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const {id} = useParams();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

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
    async function uploadFile(file: File) {
        if (!file) return null;

        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);

        const url = await getDownloadURL(storageRef);
        return url;
    }

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setLoading(true);
            const url = await uploadFile(selectedFile);
            if (!url || !id) return;
            await uploadData(url,id);
            setLoading(false);
            navigate('/');

        } catch (error) {
            console.error("Upload failed", error);
            setLoading(false);
        }
    };


    return (
        <div
            style={{
                width: "100vw",
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                fontFamily: "Poppins",
                color: "black",
            }}
        >
            <div
                style={{
                    width: "80vw",
                    marginTop: "2rem",
                    padding: "1rem",
                    display: "flex",
                    gap: "0.5rem",
                    flexDirection: "column",
                    backgroundColor:"white"
                }}
            >
                <p style={{ textAlign: "start", fontSize: "1.5rem", fontWeight: "700" }}>
                    {t("upload_photos_title")}
                </p>
                <p style={{ textAlign: "start", fontSize: "1rem", fontWeight: "200" }}>
                    {t("upload_photos_info")}
                </p>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*"
            />

            <div
                style={{
                    width: "100vw",
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt={"photo"}
                        style={{ width: "80vw", height: "25rem", objectFit: "contain", borderRadius: "1rem",zIndex:99 }}
                        onClick={openFilePicker}
                    />
                ) : (
                    <div
                        style={{
                            width: "80vw",
                            height: "25rem",
                            borderRadius: "1rem",
                            backgroundColor: "#eeeeee",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onClick={openFilePicker}
                    >
                        <FontAwesomeIcon icon={faPlus} color={"#aeaeae"} size={"2x"} />
                    </div>
                )}
            </div>

            <div
                style={{
                    width: "100vw",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "2rem",
                    marginBottom:"2rem"
                }}
            >
                {
                    loading ?<Loader loading={loading} color={"red"}/> :
                        <MainButton title={t("upload_and_join")} color={"white"} onClick={()=>handleUpload()} />

                }
            </div>
        </div>
    );
};

export default SelfieScreen;

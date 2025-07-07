import {useEffect, useState} from "react";
import {doc, onSnapshot} from "firebase/firestore";
import {analytics, db} from "../../services/firebaseConfig.tsx";
import {useTranslation} from "react-i18next";
import {faClock} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {MainButton} from "../../components/Buttons.tsx";
import maps from "../../assets/images/maps.png"
import {useNavigate, useParams} from "react-router-dom";
import {logEvent} from "firebase/analytics";



type PartyData ={
    localPhotoUrl:string;
    partyTitle:string;
    partyFee:string;
    partyDescription:string;
    partyPromotion:string;
    partyBrandPromoted:string;
    partyNotes:string;
    localName:string;
    fullAddress :string;
    localGoogleMapsUrl :string;
    localDescription:string;
    localCapacity:string;
}
const PartyDetail = () => {
    const {t} = useTranslation();
    const [details, setDetails] = useState<PartyData>();
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState(1);
    const navigate = useNavigate();
    const {id} = useParams();

    const getData = async () => {
        try {
            if (!id) return ;

            const docRef = doc(db, "parties", id);

            const unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    // @ts-ignore
                    setDetails(docSnap.data());
                    const data = docSnap.data();
                    logEvent(analytics, 'party_selected', {
                        party_id : id,
                        party_name :data.localName,
                        city:data.localCity,
                        country:data.country
                    });
                } else {
                    setDetails(undefined);
                }
                setLoading(false);
            }, (err) => {
                console.error("Firebase snapshot error:", err);
                setLoading(false);
            });

            return unsubscribe;
        } catch (error) {
            console.error("Firestore fetch error:", error);
            setLoading(false);
        }
    };
    useEffect(() => {
        logEvent(analytics, 'screen_view', {
            firebase_screen: 'party_detail_screen',
            firebase_screen_class: 'PartyScreens',
        });
    }, []);

    useEffect(() => {
        const unsubscribe = getData();
        return () => {
            if (unsubscribe && typeof unsubscribe === 'function') {
                // @ts-ignore
                unsubscribe();
            }
        };
    }, []);

    // Loading state
    if (loading) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                fontFamily: 'Poppins',
                color:"black",
            }}>
                <p>Loading party details...</p>
            </div>
        );
    }

    // Error state

    if (!details) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                fontFamily: 'Poppins'
            }}>
                <p>No party details found.</p>
            </div>
        );
    }

    const formatDateTime = (timestamp: string | number | Date) => {
        if (!timestamp) return {date: 'N/A', time: 'N/A'};

        const date = new Date(timestamp);
        const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
        return {
            date: new Intl.DateTimeFormat('es-ES', dateOptions).format(date),
            time: new Intl.DateTimeFormat('es-ES', timeOptions).format(date)
        };
    };

    // @ts-ignore
    const startDateTime = formatDateTime(details.partyStartDateTime);
    // @ts-ignore
    const endDateTime = formatDateTime(details.partyEndDateTime);


    return (
        <div style={{width: '100vw', backgroundColor: 'white'}}>
            {details.localPhotoUrl && <img src={details.localPhotoUrl} alt="Party" style={{
                backgroundSize: "contain",
                height: "20rem"
            }}/>}

            <div style={{
                width: '100vw',
                backgroundColor: "white",
                height: '6rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <div style={{
                    width: '45vw',
                    backgroundColor: selectedOption === 1 ? 'red' : 'white',
                    height: '4rem',
                    borderRadius: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontFamily: "Poppins",
                    cursor: "pointer"
                }}
                     onClick={() => setSelectedOption(1)}
                >
                    <p style={{color: selectedOption === 1 ? "white" : "grey", fontWeight: "600",fontSize:"1.5rem"}}>{t('party_info')}</p>
                </div>
                <div style={{
                    width: '45vw',
                    backgroundColor: selectedOption === 2 ? 'red' : 'white',
                    height: '4rem',
                    borderRadius: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontFamily: "Poppins",
                    cursor: "pointer"
                }} onClick={() => setSelectedOption(2)}>
                    <p style={{color: selectedOption === 2 ? "white" : "grey", fontWeight: "600",fontSize:"1.5rem"}}>{t('club_info')}</p>
                </div>
            </div>
            {
                selectedOption === 1 ? <div style={{
                    width: "100vw",
                    backgroundColor: "white",
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    fontFamily: "Poppins",
                    textAlign: "start"
                }}>
                    <p style={{
                        fontSize: "2rem",
                        fontWeight: "700",
                        display: "flex",
                        width: '90vw'
                    }}>{details.partyTitle || 'Untitled Party'}</p>
                    <p style={{
                        fontWeight: "600",
                        display: "flex",
                        width: '90vw'
                    }}>{t('party_fees')}: {details.partyFee || 'Free'}</p>

                    {details.partyDescription && (
                        <div style={{
                            backgroundColor: "#e3e0e0",
                            width: "90vw",
                            borderRadius: "0.2rem",
                            display: "flex",
                            alignItems: 'start',
                            flexDirection: 'column',
                            fontFamily: "Poppins",
                            paddingBottom: '1rem',
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                            marginTop: "0.5rem",
                            textAlign: "start",
                            margin: "0.5rem",
                            padding: "0.5rem"
                        }}>
                            <p style={{fontWeight: "600"}}>{t('description')}</p>
                            <p style={{fontWeight: "200"}}>{details.partyDescription}</p>
                        </div>
                    )}

                    <div style={{
                        backgroundColor: "white",
                        height: 'auto',
                        minHeight: '5rem',
                        width: "90vw",
                        borderRadius: "0.2rem",
                        display: "flex",
                        alignItems: 'start',
                        justifyContent: "center",
                        flexDirection: 'row',
                        fontFamily: "Poppins",
                        paddingBottom: '0.5rem',
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        marginTop: "1rem",
                        textAlign: "start",
                        boxShadow: "1px 1px 1px 1px rgba(0,0,0,0.5)",
                        margin: "0.5rem",
                        padding: "0.5rem"

                    }}>
                        <div style={{
                            width: '45vw',
                            height: 'auto',
                            borderRight: '1px solid #e3e0e0',
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "start",
                            gap: "0.5rem",

                        }}>
                            <div style={{
                                marginTop: "0.5rem",
                            }}>
                                <FontAwesomeIcon icon={faClock} color="green" size='1x'/>
                            </div>
                            <div style={{fontFamily: "Poppins"}}>
                                <p style={{fontWeight: "200"}}>{t('starting_time')}</p>
                                <p style={{fontWeight: "600"}}>{startDateTime.date}</p>
                                <p style={{fontWeight: "700"}}>{startDateTime.time} h</p>
                            </div>
                        </div>

                        <div style={{
                            width: '45vw',
                            height: 'auto',
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "start",
                            gap: "0.5rem",
                            paddingLeft: "1rem",
                        }}>
                            <div style={{
                                marginTop: "0.5rem",
                            }}>
                                <FontAwesomeIcon icon={faClock} color="red" size={'1x'}/>
                            </div>
                            <div>
                                <p style={{fontWeight: "200"}}>{t('ending_time')}</p>
                                <p style={{fontWeight: "600"}}>{endDateTime.date}</p>
                                <p style={{fontWeight: "600"}}>{endDateTime.time} h</p>
                            </div>
                        </div>
                    </div>

                    {details.partyPromotion && (
                        <div style={{
                            display: "flex",
                            flexDirection: 'column',
                            alignItems: 'start',
                        }}>
                            <p style={{
                                fontSize: "1.5rem",
                                marginTop: "1rem",
                                fontWeight: "600",
                                fontFamily: "Poppins"
                            }}>{t('party_promotion')}</p>
                            <div style={{
                                backgroundColor: "#e3e0e0",
                                width: "90vw",
                                borderRadius: "0.2rem",
                                display: "flex",
                                alignItems: 'start',
                                flexDirection: 'column',
                                fontFamily: "Poppins",
                                paddingLeft: "1rem",
                                paddingRight: "1rem",
                                marginTop: "0.5rem",
                                textAlign: "start",
                                padding: "0.5rem",
                                margin: "0.5rem"

                            }}>
                                <p style={{fontWeight: "200"}}>{details.partyPromotion}</p>
                            </div>
                        </div>
                    )}

                    {details.partyBrandPromoted && (
                        <div style={{
                            display: "flex",
                            flexDirection: 'column',
                            alignItems: 'start',
                        }}>
                            <p style={{
                                fontSize: "1.5rem",
                                marginTop: "1rem",
                                fontWeight: "600",
                                fontFamily: "Poppins"
                            }}>{t('party_brand')}</p>
                            <div style={{
                                backgroundColor: "#e3e0e0",
                                borderRadius: "0.2rem",
                                display: "flex",
                                alignItems: 'start',
                                flexDirection: 'column',
                                fontFamily: "Poppins",
                                paddingLeft: "1rem",
                                paddingRight: "1rem",
                                marginTop: "0.5rem",
                                textAlign: "start",
                                padding: "0.5rem",
                                width: "90vw",
                                margin: "0.5rem"

                            }}>
                                <p style={{fontWeight: "200"}}>{details.partyBrandPromoted}</p>
                            </div>
                        </div>
                    )}

                    {details.partyNotes && (
                        <div style={{
                            display: "flex",
                            flexDirection: 'column',
                            alignItems: 'start',
                        }}>
                            <p style={{
                                fontSize: "1.5rem",
                                marginTop: "1rem",
                                fontWeight: "600",
                                fontFamily: "Poppins"
                            }}>{t('party_notes')}</p>
                            <div style={{
                                backgroundColor: "#e3e0e0",
                                borderRadius: "0.2rem",
                                display: "flex",
                                alignItems: 'start',
                                flexDirection: 'column',
                                fontFamily: "Poppins",
                                paddingLeft: "1rem",
                                paddingRight: "1rem",
                                marginTop: "0.5rem",
                                textAlign: "start",
                                marginBottom: "6rem",
                                padding: "0.5rem",
                                width: "90vw",
                                margin: "0.5rem"

                            }}>
                                <p style={{fontWeight: "200"}}>{details.partyNotes}</p>
                            </div>
                        </div>
                    )}

                    <div style={{
                        width: "100vw",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "10rem",
                        marginTop: "5rem",

                    }}>
                        <MainButton title={t('join_the_party')} color={"white"} onClick={() => {
                            navigate(`/selfie/${id}`)
                        }}/>
                    </div>
                </div> : <div style={{
                    width: "100vw",
                    backgroundColor: "white",
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    fontFamily: "Poppins",
                }}>
                    <div style={{
                        backgroundColor: "white",
                        width: "90vw",
                        padding: "0.5rem",
                        borderRadius: "0.2rem",
                        display: "flex",
                        alignItems: 'start',
                        flexDirection: 'column',
                        fontFamily: "Poppins",
                        paddingBottom: '1rem',
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        marginTop: "0.5rem",
                        textAlign: "start",
                        margin: "0.5rem"
                    }}
                    >
                        <p style={{fontSize: "1.5rem", fontWeight: "600"}}>{details.localName}</p>
                        <div style={{
                            width: "90vw",
                            display: "flex",
                        }}>
                            <div style={{width: "70vw", marginTop: "1rem"}}>
                                <p>{details.fullAddress}</p>
                            </div>
                            <div style={{
                                width: "30vw",
                                display: "flex",
                                justifyContent: "end",
                                alignItems: "center",
                                cursor: "pointer"
                            }} onClick={() => window.open(details.localGoogleMapsUrl, '_blank')}
                                 className={"forgot-password-btn"}>
                                <img src={maps} style={{height: "5rem", width: "5rem"}} alt={"location"}/>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        display: "flex",
                        flexDirection: 'column',
                        alignItems: 'start',
                        width: "90vw",
                    }}>
                        <p style={{
                            fontSize: "1.5rem",
                            marginTop: "1rem",
                            fontWeight: "600",
                            fontFamily: "Poppins"
                        }}>{t('description')}</p>
                    </div>
                    <div style={{
                        backgroundColor: "#e3e0e0",
                        width: "90vw",
                        borderRadius: "0.2rem",
                        display: "flex",
                        alignItems: 'start',
                        flexDirection: 'column',
                        fontFamily: "Poppins",
                        paddingBottom: '1rem',
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        marginTop: "0.5rem",
                        textAlign: "start",
                        margin: "0.5rem"
                    }}
                    >
                        <p style={{fontWeight: "200", padding: "0.5rem"}}>{details.localDescription}</p>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: 'column',
                        alignItems: 'start',
                        width: "90vw",
                    }}>
                        <p style={{fontWeight: "500"}}>{t('total_capacity')} : {details.localCapacity}</p>
                    </div>

                    <div style={{
                        width: "100vw",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "10rem",
                        marginTop: "5rem",

                    }}>
                        <MainButton title={t('join_the_party')} color={"white"} onClick={() => {
                            navigate(`/selfie/${id}`)
                        }}/>
                    </div>
                </div>
            }
        </div>
    );
};

export default PartyDetail;

import {useTranslation} from "react-i18next";
import PartyCard from "../../components/PartyCard.tsx";
import {useEffect, useState} from "react";
import {onSnapshot, collection, type DocumentData} from "firebase/firestore";
import {db} from "../../services/firebaseConfig.tsx";
import Loader from "../../components/loader.tsx";

const PartyList = () => {
    const {t} = useTranslation();
    const [parties, setParties] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'parties'), (querySnap) => {
            const partyArray: ((prevState: never[]) => never[]) | DocumentData[] = [];
            querySnap.forEach(doc => {
                const data = doc.data();
                if (data.partyStatus=='Open')
                partyArray.push(doc.data());

            });
            // @ts-ignore
            setParties(partyArray);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div style={{
            width: '100vw',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            color: "black",
            backgroundColor: 'white',
        }}>
            {
                loading ? (
                    <div style={{width: '100vw', height: '100vh', alignItems: 'center',justifyContent: 'center'}}>
                        <Loader loading={loading} color={"#FF0000"}/>
                    </div>
                ) : (
                    <>
                        <p style={{
                            fontFamily: "Poppins",
                            fontSize: "2rem",
                            fontWeight: "700",
                            width: '90vw',
                            textAlign: "start"
                        }}>
                            {t('list_of_parties')}
                        </p>

                        {parties.map((party, index) => (
                            <div key={index}>
                                <PartyCard party={party}/>
                            </div>
                        ))}
                    </>
                )
            }
        </div>
    );
};

export default PartyList;

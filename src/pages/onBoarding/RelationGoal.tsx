import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {auth, db} from "../../services/firebaseConfig.tsx";
import {doc, updateDoc} from "firebase/firestore";
import ProgressBar from "../../components/ProgressBar.tsx";
import Text from "../../components/customText.tsx";
import {CardsButtons, MainButton} from "../../components/Buttons.tsx";
import '../../styles/auth.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import Loader from "../../components/loader.tsx";
import {toast} from "react-toastify";

const RelationshipGoals = () => {
    const {t} = useTranslation();
    const [selected, setSelected] = useState<number>(1);
    //1 for DATING , 2 for FRIENDSHIP , 3 for CASUAL , 4 FOR SERIOUS
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        const user = auth.currentUser;
        setLoading(true);
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            try {
                await updateDoc(userRef, {
                    relationShipGoal: selected === 1 ? 'DATING' : selected === 2 ? 'FRIENDSHIP' : selected === 3 ? 'CASUAL' : selected === 4 ? 'SERIOUS_RELATIONSHIP' : null
                });
                navigate('/')
                setLoading(false);
            } catch (error) {
                console.error('Error updating relations:', error);
                setLoading(false);
            }
        }
    };
    return (
        <div style={{height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <div style={{position: 'absolute', top: 30, left: 30}} className="forgot-password-btn"
                 onClick={() => navigate(-1)}>
                <FontAwesomeIcon icon={faArrowLeft}  color={"black"} style={{
                    height:"1.5rem",
                    width:"1.5rem",
                }}/>
            </div>
            <div style={{marginTop: '2rem'}}>
                <ProgressBar width={"60vw"}/>
            </div>

            <div
                style={{
                    width: '90vw',
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '1rem',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    textAlign: "start",
                    gap: "0.5rem"
                }}
            >
                <Text
                    color="black"
                    size={'1.5rem'}
                    fontWeight="700"
                    text={t('relationship_goals_title')}
                />
                <Text
                    color="black"
                    size="1rem"
                    fontWeight="normal"
                    text={t('relationship_goals_info')}
                    className="text-align"
                />
            </div>

            {
                selected === 1 ? <div style={{
                    width: '90vw',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    color: "black",
                    marginTop: "3rem",
                }}>
                    <CardsButtons title={t('dating')} subtitle={t('dating_info')} borderColor={"red"}
                                  onClick={() => setSelected(1)} size={"5px"} color={'black'} weight={"bold"} subTextWeight={"400"}/>
                    <CardsButtons title={t('friendship')} subtitle={t('friendship_info')} borderColor={"grey"}
                                  onClick={() => setSelected(2)} size={"1px"} color={'grey'} weight={"bold"} subTextWeight={"400"}/>
                    <CardsButtons title={t('casual')} subtitle={t('casual_info')} borderColor={"grey"}
                                  onClick={() => setSelected(3)} size={"1px"} color={'grey'} weight={"bold"} subTextWeight={"400"}/>
                    <CardsButtons title={t('serious_relationship')} subtitle={t('serious_relationship_info')}
                                  borderColor={"grey"} onClick={() => setSelected(4)} size={"1px"} color={'grey'} weight={"bold"} subTextWeight={"400"}/>

                </div> : selected === 2 ? <div style={{
                    width: '90vw',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    color: "black",
                    marginTop:"3rem"


                }}>
                    <CardsButtons title={t('dating')} subtitle={t('dating_info')} borderColor={"grey"}
                                  onClick={() => setSelected(1)} size={"1px"} color={'grey'} weight={"bold"} subTextWeight={"400"}/>
                    <CardsButtons title={t('friendship')} subtitle={t('friendship_info')} borderColor={"red"}
                                  onClick={() => setSelected(2)} size={"5px"} color={'black'} weight={"bold"} subTextWeight={"400"}/>
                    <CardsButtons title={t('casual')} subtitle={t('casual_info')} borderColor={"grey"}
                                  onClick={() => setSelected(3)} size={"1px"} color={'grey'} weight={"bold"} subTextWeight={"400"}/>
                    <CardsButtons title={t('serious_relationship')} subtitle={t('serious_relationship_info')}
                                  borderColor={"grey"} onClick={() => setSelected(4)} size={"1px"} color={'grey'} weight={"bold"} subTextWeight={"400"}/>
                </div> : selected === 3 ? <div style={{
                    width: '90vw',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    color: "black", marginTop: "3rem"


                }}>
                    <CardsButtons title={t('dating')} subtitle={t('dating_info')} borderColor={"grey"}
                                  onClick={() => setSelected(1)} size={"1px"} color={'grey'} weight={"bold"} subTextWeight={"400"}/>
                    <CardsButtons title={t('friendship')} subtitle={t('friendship_info')} borderColor={"grey"}
                                  onClick={() => setSelected(2)} size={"1px"} color={'grey'} weight={"bold"} subTextWeight={"400"}/>
                    <CardsButtons title={t('casual')} subtitle={t('casual_info')} borderColor={"red"}
                                  onClick={() => setSelected(3)} size={"5px"} color={'black'} weight={"bold"} subTextWeight={"400"}/>
                    <CardsButtons title={t('serious_relationship')} subtitle={t('serious_relationship_info')}
                                  borderColor={"grey"} onClick={() => setSelected(4)} size={"1px"} color={'grey'} weight={"bold"} subTextWeight={"400"}/>

                </div> : selected === 4 ? <div style={{
                    width: '90vw',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    color: "black",
                    marginTop:"3rem"


                }}>
                    <CardsButtons title={t('dating')} subtitle={t('dating_info')} borderColor={"gray"}
                                  onClick={() => setSelected(1)} size={"1px"} color={'grey'} weight={"bold"} subTextWeight={"400"}/>
                    <CardsButtons title={t('friendship')} subtitle={t('friendship_info')} borderColor={"grey"}
                                  onClick={() => setSelected(2)} size={"1px"} color={'grey'} weight={"bold"} subTextWeight={"400"}/>
                    <CardsButtons title={t('casual')} subtitle={t('casual_info')} borderColor={"grey"}
                                  onClick={() => setSelected(3)} size={"1px"} color={'grey'} weight={"bold"} subTextWeight={"400"}/>
                    <CardsButtons title={t('serious_relationship')} subtitle={t('serious_relationship_info')}
                                  borderColor={"red"} onClick={() => setSelected(4)} size={"5px"} color={'black'} weight={"bold"} subTextWeight={"400"}/>

                </div> : null
            }

            <div style={{position:"fixed",bottom:10}}>
                {
                    loading ? <Loader loading={loading} color={"red"}/>: <MainButton title={t('continue_button')} color={'white'} onClick={() => {
                        if (selected === 1 || selected === 2 || selected === 3 || selected === 4) {
                            fetchData()
                        } else toast.error('Error');
                    }}/>
                }
            </div>

        </div>

    )
}

export default RelationshipGoals;
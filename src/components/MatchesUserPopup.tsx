import {useTranslation} from "react-i18next";




type Props = {
    userId?: string;
    onClick?: () => void,
    profileOne: string,
    profileTwo: string,
    partyId?: string,
}




const MatchesUserPopup = ({profileOne,profileTwo,onClick}:Props) => {
    const {t} = useTranslation();

    return (
        <div style={{
            height: "100vh",
            width: "100vw",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: "transparent"
        }}>
            <div style={{
                height: "50%",
                width: "80%",
                backgroundColor: "white",
                borderRadius: "1rem",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
                zIndex: 1999,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "2rem"
            }}>
                <div style={{
                    display: "flex",
                    position: "relative",
                    width: "100%",
                    height: "7rem",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    {/* Left Image */}
                    <img src={profileOne} style={{
                        position: "absolute",
                        left: "55%",
                        transform: "translateX(-100%)",
                        height: "5rem",
                        width: "5rem",
                        backgroundColor: "white",
                        padding: "1rem",
                        borderRadius: "50%",
                        border: "1px solid black",
                        zIndex: 1
                    }}/>

                    {/* Right Image */}
                    <img src={profileTwo} style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(0%)",
                        height: "5rem",
                        width: "5rem",
                        backgroundColor: "white",
                        padding: "1rem",
                        borderRadius: "50%",
                        border: "1px solid black",
                        zIndex: 2
                    }}/>
                </div>

                <div style={{fontFamily: "Poppins"}}>
                    <p style={{fontSize: "1.5rem", fontWeight: "600"}}>{t('you_got_the_matches')}</p>
                </div>
                <div style={{fontFamily: "Poppins"}}>
                    <p style={{fontWeight: "200"}}>
                        {t('you_both_like_each_other')}
                    </p>
                </div>


                <div style={{backgroundColor: "#FF0000", padding: '0.9rem', borderRadius: "2rem", width: '80%'}}
                     className="MainButton"
                     onClick={ ()=>{
                         if (onClick) {
                             onClick()
                         }
                     }}
                >
                    <p style={{
                        fontFamily: "Poppins",
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center"
                    }}>{t('ok')}</p>
                </div>

            </div>
        </div>
    )
}

export default MatchesUserPopup;
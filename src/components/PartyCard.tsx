import Maps from '../assets/images/maps.png'
import {useNavigate} from "react-router-dom";


// @ts-ignore
const PartyCard = ({party}) => {

    const date = new Date(party.partyStartDateTime);

    const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

    const formattedDate = new Intl.DateTimeFormat('es-ES', dateOptions).format(date);
    const formattedTime = new Intl.DateTimeFormat('es-ES', timeOptions).format(date);
    const navigate = useNavigate();
    return (
        <div style={{
            width: '90vw',
            backgroundColor: '#e1e1e1',
            borderRadius: '1rem',
            margin: '1rem',
            paddingBottom: '1rem',
            cursor: 'pointer',
        }}
             className={"forgot-password-btn "}
             onClick={async () => {
                 navigate(`/party/details/${party.id}`);
             }}
        >
            <img src={party.localPhotoUrl} style={{
                height: '15rem',
                width: '90vw',
                borderTopRightRadius: '1rem',
                borderTopLeftRadius: '1rem',
                outline: "none"
            }}
                 alt={"image"}
            />

            <div style={{
                width: '90%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '1rem',
                fontFamily: "Poppins",
                textAlign:"start"
            }}>
                <p style={{fontSize: "1.5rem", fontWeight: "bold"}}>{party.partyTitle}</p>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: "space-between",
                    width: '100%',
                    position: "relative",
                }}>
                    <div style={{width: '80vw', display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                        <p style={{textAlign: "start",fontWeight:"600"}}>{formattedDate} : {formattedTime} h</p>
                        <p style={{textAlign: "start",fontWeight:"200"}}>{party.fullAddress}</p>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        marginRight: '2rem',
                    }}
                    >
                        <img src={Maps} style={{height: '3rem', width: '3rem'}}
                             onClick={() => window.open(party.localGoogleMapsUrl, '_blank')} alt={"location"}/>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PartyCard;
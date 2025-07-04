import '../styles/inputs.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


type Props = {
    label: string;
    type: string;
    placeholder: string;
    icon: any, onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    maxLength?: number;

}

export const TextInputNew = ({label, type, placeholder, icon,onChange,value,maxLength}: Props) => {
    return (
        <div style={{width:"100vw",display:"flex",flexDirection:"column",alignItems:"start"}}>
            <label style={{
                display: "flex",
                justifyContent: "start",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                fontFamily: "Poppins"
            }}>{label}</label>
            <div style={{position: "relative",color:"black"}}>
                <FontAwesomeIcon icon={icon} style={{position: "absolute", top: "1rem", left: "1.1rem"}}/>

                <input placeholder={placeholder} type={type} style={{
                    paddingLeft: 10,
                    height: "3rem",
                    fontSize: '18px',
                    border: 0,
                    backgroundColor: "#efeeee",
                    outline: "none",
                    borderRadius: "0.3rem",
                    width: "90vw",
                    color:"black"
                }}
                       className="email-input"
                       onChange={onChange}
                       value={value}
                       maxLength={maxLength}
                />
            </div>

        </div>
    )
}
const TextInput = ({label, type, placeholder, icon,onChange,value,maxLength}: Props) => {
    return (
        <>
            <label style={{
                display: "flex",
                justifyContent: "start",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                fontFamily: "Poppins"
            }}>{label}</label>
            <div style={{position: "relative",color:"black",display:"flex",justifyContent:"center",alignItems:'center',flexDirection:"column"}}>
                <FontAwesomeIcon icon={icon} style={{position: "absolute", top: "1rem", left: "1.1rem"}}/>
                <input placeholder={placeholder} type={type} style={{
                    paddingLeft: 50,
                    height: "3rem",
                    fontSize: '18px',
                    border: 0,
                    backgroundColor: "#efeeee",
                    outline: "none",
                    borderRadius: "0.3rem",
                    width: "70vw",
                    color:"black",
                }}
                       className="email-input"
                       onChange={onChange}
                       value={value}
                       maxLength={maxLength}
                />
            </div>

        </>
    )
}

 export const TextInputPhone = ({label, type, placeholder, icon,onChange,value,maxLength}: Props) => {
    return (
        <>
            <label style={{
                display: "flex",
                justifyContent: "start",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                fontFamily: "Poppins"
            }}>{label}</label>
            <div style={{position: "relative",color:"black",display:"flex",justifyContent:"center",alignItems:'center',flexDirection:"column"}}>
                <FontAwesomeIcon icon={icon} style={{position: "absolute", top: "1rem", left: "1.1rem"}}/>
                <span style={{
                    position: "absolute",
                    zIndex:99,
                    color:"black",
                    left: "0.5rem",
                    fontSize:"1.2rem",
                    fontWeight:"700",
                    fontFamily: "Poppins",
                }}>+34</span>
                <input placeholder={placeholder} type={type} style={{
                    paddingLeft: 50,
                    height: "3rem",
                    fontSize: '18px',
                    border: 0,
                    backgroundColor: "#efeeee",
                    outline: "none",
                    borderRadius: "0.3rem",
                    width: "70vw",
                    color:"black",
                }}
                       className="email-input"
                       onChange={onChange}
                       value={value}
                       maxLength={maxLength}
                />
            </div>

        </>
    )
}



export const TextInputName = ({label, type, placeholder, icon,onChange,value,maxLength}: Props) => {
    return (
        <>
            <label style={{
                display: "flex",
                justifyContent: "start",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                fontFamily: "Poppins"
            }}>{label}</label>
            <div style={{position: "relative",color:"black",display:"flex",justifyContent:"center",alignItems:'center',flexDirection:"column"}}>
                <FontAwesomeIcon icon={icon} style={{position: "absolute", top: "1rem", left: "1.1rem"}}/>
                <input placeholder={placeholder} type={type} style={{
                    paddingLeft:"1rem",
                    paddingRight:"1rem",
                    height: "3rem",
                    fontSize: '18px',
                    border: 0,
                    backgroundColor: "#efeeee",
                    outline: "none",
                    borderRadius: "0.3rem",
                    width: "70vw",
                    color:"black",
                    textAlign:"center",
                    fontWeight:"bold"
                }}
                       className="email-input"
                       onChange={onChange}
                       value={value}
                       maxLength={maxLength}
                />
            </div>

        </>
    )
}


export default TextInput;
import '../styles/buttons.css';
type ButtonProps = {
    title: string;
    color?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}
export const MainButton=({title,color,onClick}:ButtonProps)=>{
    return (
        <div style={{backgroundColor:"#FF0000",padding:'0.9rem',borderRadius:"2rem",width:'80vw'}} onClick={onClick} className="MainButton">
            <p style={{fontFamily:"Poppins",color:color,fontWeight:"bold",textAlign:"center",fontSize:"1.5rem"}}>{title}</p>
        </div>
    )
}

export const MainButtonInactive=({title,color,onClick}:ButtonProps)=>{
    return (
        <div style={{backgroundColor:"#d0d0d0",padding:'0.9rem',borderRadius:"2rem",width:'80vw'}} onClick={onClick} className="MainButton">
            <p style={{fontFamily:"Poppins",color:color,fontWeight:"bold",textAlign:"center",fontSize:"1.5rem"}}>{title}</p>
        </div>
    )
}


export const OutlineButton=({title,color,onClick}:ButtonProps)=>{
    return (
        <div style={{backgroundColor:"white",padding:'0.9rem',borderRadius:"2rem",width:'80vw',border:"1px solid red"}} onClick={onClick} className="MainButton">
            <p style={{fontFamily:"Poppins",color:color,fontWeight:"normal"}}>{title}</p>
        </div>
    )
}

export const SimpleButton=({title,color,onClick}:ButtonProps)=>{
    return (
        <div onClick={onClick} className="MainButton">
           <p style={{color:color,fontFamily:"Poppins"}}>{title}</p>
        </div>
    )
}
type CardsButtonsProps={
    title: string,
    subtitle: string,
    borderColor: string,
    size: string,
    weight: string,
    subTextWeight: string,
    color: string,
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export const CardsButtons=({title,subtitle,borderColor,onClick,size,weight,color,subTextWeight}:CardsButtonsProps)=>{
    return (
        <div style={{backgroundColor:"white",border:`${size} solid ${borderColor}`,borderRadius:'1rem',fontFamily:"Poppins",padding:'0.5rem',color:`${color}`}} onClick={onClick} >
            <p style={{fontSize:"1.1rem",fontWeight:`${weight}`,textAlign:"left"}} >{title}</p>
            <p style={{fontSize:"16px",fontWeight:`${subTextWeight}`,textAlign:"left"}}>{subtitle}</p>
        </div>
    )
}

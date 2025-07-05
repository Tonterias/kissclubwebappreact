import '../styles/auth.css';
type Props={
    color:string;
    size:string;
    fontWeight:string;
    text:string;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;

}
const Text =({color,fontWeight,size,text,className,onClick}:Props)=>{
    return (
        <p style={{fontFamily:"Poppins",color:color,fontWeight:fontWeight,fontSize:size}} className={className} onClick={onClick}>{text}</p>
    )
}

export default Text;
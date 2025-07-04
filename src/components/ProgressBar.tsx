
type Props={
    width:string;
}
const ProgressBar=({width}:Props)=>{
return(
    <div style={{width:'60vw',backgroundColor:"#eae6e6",height:'1.5rem',borderRadius:'1rem'}}>
        <div style={{width:width,backgroundColor:"#FF0000",height:'1.5rem',borderRadius:'1rem'}}></div>
    </div>
)
}

export default ProgressBar;
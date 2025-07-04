import { ClipLoader } from "react-spinners";

type LoaderProps = {
    loading: boolean;
    color: string;
}

const CommonLoader = ({ loading,color }: LoaderProps) => {
    return (
        <ClipLoader size={40} color={color} loading={loading} />
    );
}

export default CommonLoader;



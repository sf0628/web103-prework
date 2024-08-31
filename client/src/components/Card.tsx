import { useNavigate } from "react-router-dom";
import { CreatorDetails } from "../types/types";

interface CardProps {
    creator: CreatorDetails
}

function Card({ creator}: CardProps) {
    const navigate = useNavigate();
    
    const handleClickEditCard = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        navigate(`/edit-creator/${creator.creatorId}`);
    };

    return (
        <>
        <div className="card-content" >
            <h2 className="card-name">{creator.name}</h2>
            <p className="card-url">{creator.url}</p>
            <p className="card-description">{creator.description}</p>
            <img src={creator.imageUrl} alt="Image of Creator" className="card-image" />
            <button className="card-edit" onClick={handleClickEditCard}>Edit</button>
            
        </div>
        </>
    )
}

export default Card;
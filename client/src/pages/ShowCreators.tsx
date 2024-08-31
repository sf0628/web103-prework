import { CreatorDetails } from "../types/types";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client";
import { useState, useEffect } from "react";

interface ShowCreatorsPageProps {
    creators: CreatorDetails[];
}

function ShowCreatorsPage({ creators }: ShowCreatorsPageProps) {
    const [deleteId, setDeleteId] = useState<string>("");
    const [modal, setModal] = useState<boolean>(false);
    const [creatorInfo, setCreatorInfo] = useState<CreatorDetails[]>(creators);
    const navigate = useNavigate();

    const toggleModal = () => {
        setModal(!modal);
    };

    const handleClickCreator = (creatorId: string) => {
        navigate(`/view-creator/${creatorId}`);
    };

    const handleClickAddCreator = () => {
        navigate(`/add-creator`);
    };

    const handleDeleteCreator = async () => {
        const { error } = await supabase
            .from("creators")
            .delete()
            .eq("creatorId", deleteId);

        if (error) {
            console.error("Error deleting creator:", error.message);
        } else {
            const { data, error } = await supabase
                .from("creators")
                .select("*");
                
            if (error) {
                console.error("Error fetching creators:", error.message);
            } else {
                setCreatorInfo(data || []);
            }
            console.log("Creator deleted successfully");
            toggleModal(); // Show the modal after deletion
        }
    };

    const initiateDelete = (creatorId: string) => {
        setDeleteId(creatorId);
        handleDeleteCreator();
    };

    useEffect(() => {
        setCreatorInfo(creators); // Ensure creatorInfo is updated when creators prop changes
    }, [creators]);

    return (
        <>
            <h2 className="show-creators-title">All Creators</h2>
            {creatorInfo.length === 0 && (
                <p>There are currently no creators here.</p>
            )}
            {creatorInfo.length !== 0 && (
                <ul className="creators-list">
                    {creatorInfo.map((creator) => (
                        <div className="creator-thumbnail" key={creator.creatorId}>
                            <li 
                                onClick={() => handleClickCreator(creator.creatorId)}
                                className="creator-tile"
                            >
                                <h2 className="creator-title">{creator.name}</h2>
                                <img src={creator.imageUrl} alt="creator image" className="creator-image" />
                            </li>
                            <button 
                                className="delete-creator" 
                                onClick={() => initiateDelete(creator.creatorId)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </ul>
            )}
            <button className="add-creator" onClick={handleClickAddCreator}>
                Add creators
            </button>

            {modal && (
                <div className="modal">
                    <div onClick={toggleModal} className="overlay"></div>
                    <div className="modal-content">
                        <h2>Creator successfully deleted!</h2>
                        <button className="close-modal" onClick={toggleModal}>
                            X
                        </button>
                        <button className="back-button" onClick={() => navigate('/')}>Home</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ShowCreatorsPage;

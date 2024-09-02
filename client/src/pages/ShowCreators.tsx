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
    const [loading, setLoading] = useState<boolean>(true);
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
            const { data, error: fetchError } = await supabase
                .from("creators")
                .select("*");

            if (fetchError) {
                console.error("Error fetching creators:", fetchError.message);
            } else {
                setCreatorInfo(data || []);
            }
            console.log("Creator deleted successfully");
            toggleModal();  // Close modal after deletion
        }
    };

    const initiateDelete = (creatorId: string) => {
        setDeleteId(creatorId);
        toggleModal();  // Show confirmation modal before deleting
    };

    const confirmDelete = () => {
        handleDeleteCreator();
    };

    useEffect(() => {
        const fetchCreators = async () => {
            const { data, error } = await supabase
                .from("creators")
                .select("*");

            if (error) {
                console.error("Error fetching creators:", error.message);
            } else {
                setCreatorInfo(data || []);
            }

            setLoading(false);
        };

        fetchCreators();
    }, []); // Empty dependency array means this effect runs only on component mount

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="show-creator">
            <h2 className="show-creators-title">Creatorverse</h2>
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
                                <p className="creator-description">{creator.description}</p>
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
                        <h2>Are you sure you want to delete this creator?</h2>
                        <button className="confirm-delete" onClick={confirmDelete}>
                            Yes, Delete
                        </button>
                        <button className="close-modal" onClick={toggleModal}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShowCreatorsPage;

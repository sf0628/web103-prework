import { useState, useEffect } from "react";
import { supabase } from "../client";
import { useNavigate, useParams } from "react-router-dom";

function EditCreatorPage() {
    const { creatorId } = useParams<{ creatorId: string }>();
    const navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [imageURL, setImageURL] = useState<string>("");
    const [modal, setModal] = useState<boolean>(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const toggleModal = () => {
        setModal(!modal);
    };

    useEffect(() => {
        const fetchCreator = async () => {
            const { data, error } = await supabase
                .from("creators")
                .select("*")
                .eq("creatorId", creatorId)
                .single();

            if (error) {
                console.error("Error fetching creator:", error);
                setError(error.message);
            } else if (data) {
                setName(data.name);
                setUrl(data.url);
                setDescription(data.description);
                setImageURL(data.imageURL);
            }

            setLoading(false);
        };

        fetchCreator();
    }, [creatorId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleEditCreator = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { data, error } = await supabase
            .from("creators")
            .update({ name, url, description, imageURL })
            .eq("creatorId", creatorId);

        if (error) {
            console.error("Error editing creator:", error.message);
        } else {
            console.log("Creator edited successfully:", data);
            toggleModal(); // Toggle the modal after editing the creator
        }
    };

    return (
        <div className="edit-creator">
            <button className="back-button" onClick={() => navigate(-1)}>Back</button>
            <form id="creator-form" onSubmit={handleEditCreator}>
                <h2 className="form-title">Edit Creator</h2>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="url">Social Media</label>
                    <input
                        type="text"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image-url">Image URL</label>
                    <input
                        type="text"
                        id="image-url"
                        value={imageURL}
                        onChange={(e) => setImageURL(e.target.value)}
                    />
                </div>
                <button type="submit">Update</button>
            </form>

            {modal && (
                <div className="modal">
                    <div onClick={toggleModal} className="overlay"></div>
                    <div className="modal-content">
                        <h2>Creator successfully edited!</h2>
                        <button className="close-modal" onClick={toggleModal}>
                            X
                        </button>
                        <button className="back-button" onClick={() => navigate('/')}>Home</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditCreatorPage;

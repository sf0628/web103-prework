import { useState } from "react";
import { supabase } from "../client";
import { useNavigate } from "react-router-dom";

function AddCreatorPage() {
    const navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [imageURL, setImageURL] = useState<string>("");
    const [modal, setModal] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null); // Renamed from errorMessage to message

    const toggleModal = () => {
        setModal(!modal);
    };
    
    const handleClickHome = () => {
        toggleModal
        navigate('/')
    }

    const handleAddCreator = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check if the URL is unique
        const { data: existingCreators, error: queryError } = await supabase
            .from('creators')
            .select('*')
            .eq('url', url);

        if (queryError) {
            console.error("Error checking URL uniqueness:", queryError.message);
            setMessage("An error occurred while checking the URL.");
            toggleModal();
            return;
        }

        if (existingCreators && existingCreators.length > 0) {
            setMessage("The URL is already in use. Please provide a different one.");
            toggleModal();
            return;
        }

        // Insert new creator into Supabase
        const { data, error } = await supabase
            .from("creators")
            .insert([
                { name, url, description, imageURL, creatorId: name.replace(/ /g, "-") }
            ]);

        if (error) {
            console.error("Error adding creator:", error.message);
            setMessage("An error occurred while adding the creator.");
        } else {
            console.log("Creator added successfully:", data);
            setName("");
            setUrl("");
            setDescription("");
            setImageURL("");
            setMessage("Creator successfully added!");
        }

        toggleModal();
    };

    return (
        <div className="add-creator">
            <button className="back-button" onClick={() => navigate(-1)}>Back</button>
            <form id="creator-form" onSubmit={handleAddCreator}>
                <h1 className="form-title">Add New Creator</h1>
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
                <button type="submit">Add</button>
            </form>

            {modal && (
                <div className="modal">
                    <div onClick={toggleModal} className="overlay"></div>
                    <div className="modal-content">
                        <h2>{message}</h2>
                        <button className="close-modal" onClick={toggleModal}>
                            X
                        </button>
                        {message === "Creator successfully added!" && (
                            <button className="back-button" onClick={handleClickHome}>Home</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddCreatorPage;

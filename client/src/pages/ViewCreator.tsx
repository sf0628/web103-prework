import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { CreatorDetails } from "../types/types";
import { supabase } from '../client.tsx';
import Card from "../components/Card";

function ViewCreatorPage() {
    const navigate = useNavigate();
    const { creatorId } = useParams<{creatorId: string}>();
    const [creator, setCreator] = useState<CreatorDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const handleClickBackButton = () => {
        navigate(-1);
    }

    useEffect(() => {
        const fetchCreator = async () => {
          const { data, error } = await supabase
            .from('creators')
            .select('*')
            .eq('creatorId', creatorId)
            .single();
    
          if (error) {
            console.error('Error fetching creator:', error);
            setError(error.message);
          } else {
            setCreator(data || []);
          }
    
          setLoading(false);
        };
    
        fetchCreator();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="view-creator-content">
            <button className="back-button" onClick={handleClickBackButton}>Back</button>
            {creator ? (
                <Card creator={creator}/>
            ) : (
                <p>Creator not found</p>
            )}
        </div>
    )
}
export default ViewCreatorPage
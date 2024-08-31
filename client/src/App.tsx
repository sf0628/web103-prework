import { useEffect, useState } from 'react';
import { supabase } from './client.tsx';
import './App.css';

import AddCreatorPage from "./pages/AddCreator.tsx";
import EditCreatorPage from "./pages/EditCreator.tsx";
import ShowCreatorsPage from "./pages/ShowCreators.tsx";
import ViewCreatorPage from "./pages/ViewCreator.tsx";

import { BrowserRouter, useRoutes } from 'react-router-dom';

interface Creator {
  name: string;
  url: string;
  description: string;
  imageUrl: string;
  creatorId: string;
}

function AppRoutes({ creators }: { creators: Creator[] }) {
  const routes = useRoutes([
    {
      path: '/',
      element: <ShowCreatorsPage creators={creators} />
    },
    {
      path: '/add-creator',
      element: <AddCreatorPage />
    },
    {
      path: '/edit-creator/:creatorId',
      element: <EditCreatorPage />
    },
    {
      path: '/view-creator/:creatorId',
      element: <ViewCreatorPage />
    }
  ]);

  return routes;
}

function App() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      const { data, error } = await supabase
        .from('creators')
        .select('*');

      if (error) {
        console.error('Error fetching creators:', error);
      } else {
        setCreators(data || []);
      }

      setLoading(false);
    };

    fetchCreators();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <BrowserRouter>
      <AppRoutes creators={creators} />
    </BrowserRouter>
  );
}

export default App;

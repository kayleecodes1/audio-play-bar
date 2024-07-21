import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { PlaylistProvider } from './contexts/PlaylistContext';
import './index.css';

const PLAYLIST = [
    {
        title: 'Song 1',
        thumbnail: 'https://cdn2.suno.ai/5b83f352-1956-4ca2-8534-2af03bf76863_aace3111.jpeg?width=100',
        src: 'https://cdn1.suno.ai/d13a6a73-f569-4c9b-8bc4-62a8ad3ff0d2.mp3',
    },
    {
        title: 'Song 2',
        thumbnail: 'https://cdn2.suno.ai/2cf0773a-cd83-4931-8e1e-7f4eb1a2610e_a5fbe798.jpeg?width=100',
        src: 'https://cdn1.suno.ai/5d9221df-d9fc-4416-820c-5c53495e817a.mp3',
    },
    {
        title: 'Song 3',
        thumbnail: 'https://cdn2.suno.ai/9b3a0739-ebad-4a3b-97eb-40dabf4186b5_5d97716c.jpeg?width=100',
        src: 'https://cdn1.suno.ai/802abef3-cbc6-4218-9acf-eb256a205325.mp3',
    },
];

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <PlaylistProvider playlist={PLAYLIST}>
            <App />
        </PlaylistProvider>
    </React.StrictMode>,
);

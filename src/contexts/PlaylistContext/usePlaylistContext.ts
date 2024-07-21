import { useContext } from 'react';
import PlaylistContext, { PlaylistContextValue } from './PlaylistContext';

const usePlaylistContext = (): PlaylistContextValue => {
    const playlistContext = useContext(PlaylistContext);
    if (!playlistContext) {
        throw new Error('No PlaylistContext found');
    }
    return playlistContext;
};

export default usePlaylistContext;

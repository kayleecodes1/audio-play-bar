import { createContext } from 'react';

export interface PlaylistContextValue {
    currentSong: {
        title: string;
        thumbnail: string;
        currentTime: number;
        duration: number;
    },
    isPlaying: boolean;
    play: (background?: boolean) => void;
    pause: (background?: boolean) => void;
    togglePlay: () => void;
    setCurrentTime: (time: number) => void;
    navigatePrevious?: () => void;
    navigateNext?: () => void;
    volume: number;
    setVolume: (volume: number) => void;
}

const PlaylistContext = createContext<PlaylistContextValue | null>(null);

export default PlaylistContext;

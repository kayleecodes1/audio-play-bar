import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PlaylistContext, { PlaylistContextValue } from './PlaylistContext';

interface PlaylistProviderProps {
    children?: React.ReactNode;
    playlist: { title: string; thumbnail: string; src: string }[];
}

const PlaylistProvider: React.FC<PlaylistProviderProps> = ({ children, playlist }) => {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    const audioRef = useRef<HTMLAudioElement>(new Audio());

    // When the playlist changes, clamp the current song index to the range.
    useEffect(() => {
        setCurrentSongIndex((prevValue) => Math.max(0, Math.min(playlist.length - 1), prevValue));
    }, [playlist]);

    // When the current song changes, instantiate the audio and prepare for playback.
    useEffect(() => {
        const audio = new Audio(playlist[currentSongIndex].src);
        audioRef.current = audio;

        // Preload the audio.
        // Set the duration once it has loaded.
        audio.load();
        audio.oncanplaythrough = () => {
            setDuration(audio.duration);
        };

        // When the playback reaches the end, ensure it does not loop.
        audio.onended = () => {
            // If we have reached the end of the playlist, pause playback.
            if (currentSongIndex === playlist.length - 1) {
                audio.pause();
                setIsPlaying(false);
                // If there is a next song in the playlist, advance to it.
            } else {
                setCurrentSongIndex(currentSongIndex + 1);
            }
        };

        return () => {
            audioRef.current.pause();
        };
    }, [playlist, currentSongIndex]);

    // When isPlaying changes, update the playback state of the audio accordingly.
    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [currentSongIndex, isPlaying]);

    // On every render, update the current time based on the playback progress.
    useEffect(() => {
        let handle = -1;
        const tick = () => {
            setCurrentTime(audioRef.current.currentTime);
            handle = requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(handle);
        };
    }, []);

    // When volume changes, update the volume of the audio accordingly.
    useEffect(() => {
        audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }, [volume]);

    const currentSong = useMemo<PlaylistContextValue['currentSong']>(
        () => ({
            title: playlist[currentSongIndex]?.title,
            thumbnail: playlist[currentSongIndex]?.thumbnail,
            currentTime,
            duration,
        }),
        [playlist, currentSongIndex, currentTime, duration],
    );

    const play: PlaylistContextValue['play'] = useCallback(() => {
        setIsPlaying(true);
    }, []);

    const pause: PlaylistContextValue['pause'] = useCallback(() => {
        setIsPlaying(false);
    }, []);

    const togglePlay: PlaylistContextValue['togglePlay'] = useCallback(() => {
        setIsPlaying((prevState) => !prevState);
    }, []);

    const _setCurrentTime: PlaylistContextValue['setCurrentTime'] = useCallback((time) => {
        audioRef.current.currentTime = time;
    }, []);

    const navigatePrevious = useMemo<PlaylistContextValue['navigatePrevious']>(() => {
        if (currentSongIndex === 0) {
            return undefined;
        }
        return () => {
            setCurrentSongIndex((prevValue) => Math.max(0, prevValue - 1));
        };
    }, [currentSongIndex]);

    const navigateNext = useMemo<PlaylistContextValue['navigateNext']>(() => {
        if (currentSongIndex === playlist.length - 1) {
            return undefined;
        }
        return () => {
            setCurrentSongIndex((prevValue) => Math.min(playlist.length - 1, prevValue + 1));
        };
    }, [currentSongIndex, playlist.length]);

    const value = useMemo<PlaylistContextValue>(
        () => ({
            isPlaying,
            play,
            pause,
            currentSong,
            setCurrentTime: _setCurrentTime,
            togglePlay,
            navigatePrevious,
            navigateNext,
            volume,
            setVolume,
        }),
        [
            currentSong,
            isPlaying,
            play,
            pause,
            togglePlay,
            _setCurrentTime,
            navigatePrevious,
            navigateNext,
            volume,
            setVolume,
        ],
    );

    return <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>;
};

export default PlaylistProvider;

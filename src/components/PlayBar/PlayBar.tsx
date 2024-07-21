import React, { useCallback, useState } from 'react';
import PlayControls from '../PlayControls';
import SeekBar from '../SeekBar';
import VolumeControls from '../VolumeControls';
import { usePlaylistContext } from '../../contexts/PlaylistContext';
import formatTime from '../../utilities/formatTime';
import './PlayBar.css';

const PlayBar: React.FC = () => {
    const playlistContext = usePlaylistContext();

    const {
        currentSong,
        isPlaying,
        play,
        pause,
        togglePlay,
        setCurrentTime,
        navigatePrevious,
        navigateNext,
        volume,
        setVolume,
    } = playlistContext;

    const [seekState, setSeekState] = useState({
        isSeeking: false,
        wasPlaying: false,
    });

    const handleStartSeek = useCallback(
        (value: number) => {
            setSeekState({ isSeeking: true, wasPlaying: isPlaying });
            pause();
            setCurrentTime(value * currentSong.duration);
        },
        [currentSong.duration, isPlaying, pause, setCurrentTime],
    );

    const handleSeek = useCallback(
        (value: number) => {
            setCurrentTime(value * currentSong.duration);
        },
        [currentSong.duration, setCurrentTime],
    );

    const handleEndSeek = useCallback(
        (value: number) => {
            setSeekState({ isSeeking: false, wasPlaying: false });
            if (seekState.wasPlaying) {
                play();
            }
            setCurrentTime(value * currentSong.duration);
        },
        [currentSong.duration, play, setCurrentTime, seekState.wasPlaying],
    );

    const displayCurrentTime = formatTime(currentSong.currentTime);
    const displayDuration = formatTime(currentSong.duration);
    const progress = currentSong.currentTime / currentSong.duration;

    return (
        <div className="PlayBar">
            <div className="PlayBar__content">
                <div className="PlayBar__detail">
                    <img className="PlayBar__thumbnail" src={currentSong.thumbnail} />
                    <div className="PlayBar__meta">
                        <div className="PlayBar__title">{currentSong.title}</div>
                        <div className="PlayBar__time">
                            {displayCurrentTime} / {displayDuration}
                        </div>
                    </div>
                </div>
                <div className="PlayBar__play-controls">
                    <PlayControls
                        isPlaying={isPlaying || seekState.wasPlaying}
                        onSkipNext={navigateNext}
                        onSkipPrevious={navigatePrevious}
                        onTogglePlay={togglePlay}
                    />
                </div>
                <div className="PlayBar__volume-controls">
                    <VolumeControls onChange={setVolume} value={volume} />
                </div>
            </div>
            <SeekBar onEndSeek={handleEndSeek} onSeek={handleSeek} onStartSeek={handleStartSeek} value={progress} />
        </div>
    );
};

export default PlayBar;

import React, { useEffect, useRef, useState } from 'react';
import PlayControls from '../PlayControls';
import { usePlaylistContext } from '../../contexts/PlaylistContext';
import formatTime from '../../utilities/formatTime';
import './PlayBar.css';

const PlayBar: React.FC = () => {
    const playlistContext = usePlaylistContext();

    const { currentSong, isPlaying, play, pause, togglePlay, setCurrentTime, navigatePrevious, navigateNext } =
        playlistContext;

    const [dragState, setDragState] = useState({
        isDragging: false,
        wasPlaying: false,
    });

    const progressBarRef = useRef<HTMLDivElement | null>(null);

    const handleProgressMouseDown: React.MouseEventHandler = (event) => {
        event.preventDefault();
        if (!progressBarRef.current) {
            return;
        }

        setDragState({ isDragging: true, wasPlaying: isPlaying });
        pause();

        const { clientX } = event;
        const { x, width } = progressBarRef.current.getBoundingClientRect();
        const targetProgress = Math.max(0, Math.min(1, (clientX - x) / width));
        setCurrentTime(targetProgress * currentSong.duration);
    };

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (!dragState.isDragging || !progressBarRef.current) {
                return;
            }
            const { clientX } = event;
            const { x, width } = progressBarRef.current.getBoundingClientRect();
            const targetProgress = Math.max(0, Math.min(1, (clientX - x) / width));
            setCurrentTime(targetProgress * currentSong.duration);
        };

        const handleMouseUp = () => {
            setDragState({ isDragging: false, wasPlaying: false });
            if (dragState.wasPlaying) {
                play(); // TODO
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [currentSong.duration, isPlaying, play, setCurrentTime, dragState.isDragging, dragState.wasPlaying]);

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
                <div className="PlayBar__controls">
                    <PlayControls
                        isPlaying={isPlaying || dragState.wasPlaying}
                        onSkipNext={navigateNext}
                        onSkipPrevious={navigatePrevious}
                        onTogglePlay={togglePlay}
                    />
                </div>
            </div>
            <div className="PlayBar__progress-bar" ref={progressBarRef} onMouseDown={handleProgressMouseDown}>
                <div className="PlayBar__progress" style={{ width: `${progress * 100}%` }} />
            </div>
        </div>
    );
};

export default PlayBar;

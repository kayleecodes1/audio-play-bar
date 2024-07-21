import React from 'react';
import {
    Pause as PauseIcon,
    Play as PlayIcon,
    SkipNext as SkipNextIcon,
    SkipPrevious as SkipPreviousIcon,
} from '../icons';
import './PlayControls.css';

interface PlayControlsProps {
    isPlaying?: boolean;
    onSkipNext?: () => void;
    onSkipPrevious?: () => void;
    onTogglePlay?: () => void;
}

const PlayControls: React.FC<PlayControlsProps> = ({ isPlaying = false, onSkipNext, onSkipPrevious, onTogglePlay }) => {
    return (
        <div className="PlayControls">
            <button className="PlayControls__previous" disabled={!onSkipPrevious} onClick={onSkipPrevious}>
                <SkipPreviousIcon size={24} />
            </button>
            <button className="PlayControls__play" onClick={onTogglePlay}>
                {isPlaying ? <PauseIcon size={32} /> : <PlayIcon size={32} />}
            </button>
            <button className="PlayControls__next" disabled={!onSkipNext} onClick={onSkipNext}>
                <SkipNextIcon size={24} />
            </button>
        </div>
    );
};

export default PlayControls;

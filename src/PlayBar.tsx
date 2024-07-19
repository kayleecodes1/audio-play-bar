import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { PlayIcon, PauseIcon, NextIcon, PreviousIcon } from './icons';
import './PlayBar.css';

const SONGS = [
    {
        title: 'Song 1',
        src: 'https://cdn1.suno.ai/d13a6a73-f569-4c9b-8bc4-62a8ad3ff0d2.mp3',
    },
    {
        title: 'Song 2',
        src: 'https://cdn1.suno.ai/5d9221df-d9fc-4416-820c-5c53495e817a.mp3',
    },
    {
        title: 'Song 3',
        src: 'https://cdn1.suno.ai/802abef3-cbc6-4218-9acf-eb256a205325.mp3',
    },
];

const formatSeconds = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const PlayBar: React.FC = () => {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(new Audio());
    useEffect(() => {
        const audio = new Audio(SONGS[currentSongIndex].src);
        audioRef.current = audio;

        audio.load();
        audio.oncanplaythrough = () => {
            setDuration(audio.duration);
        };

        audio.onended = () => {
            if (currentSongIndex === SONGS.length - 1) {
                audio.pause();
                setIsPlaying(false);
            } else {
                setCurrentSongIndex(currentSongIndex + 1);
            }
        };

        return () => {
            audioRef.current.pause();
        };
    }, [currentSongIndex]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [currentSongIndex, isPlaying]);

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

    const togglePlay = () => {
        setIsPlaying((prevState) => !prevState);
    };

    const navigatePrevious = () => {
        setCurrentSongIndex((prevValue) => Math.max(0, prevValue - 1));
    };

    const navigateNext = () => {
        setCurrentSongIndex((prevValue) => Math.min(SONGS.length - 1, prevValue + 1));
    };

    const progressBarRef = useRef<HTMLDivElement | null>(null);
    const progressDragRef = useRef({
        isDragging: false,
    });
    const handleProgressMouseDown: React.MouseEventHandler = (event) => {
        event.preventDefault();
        if (!progressBarRef.current) {
            return;
        }

        progressDragRef.current.isDragging = true;
        audioRef.current.pause();

        const { clientX } = event;
        const { x, width } = progressBarRef.current.getBoundingClientRect();
        const targetProgress = Math.max(0, Math.min(1, (clientX - x) / width));
        audioRef.current.currentTime = targetProgress * audioRef.current.duration;
    };

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (!progressDragRef.current.isDragging || !progressBarRef.current) {
                return;
            }
            const { clientX } = event;
            const { x, width } = progressBarRef.current.getBoundingClientRect();
            const targetProgress = Math.max(0, Math.min(1, (clientX - x) / width));
            audioRef.current.currentTime = targetProgress * audioRef.current.duration;
        };

        const handleMouseUp = () => {
            progressDragRef.current.isDragging = false;
            if (isPlaying) {
                audioRef.current.play();
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isPlaying]);

    const currentSong = SONGS[currentSongIndex];
    const displayCurrentTime = formatSeconds(currentTime);
    const displayTotalTime = formatSeconds(duration);
    const progress = currentTime / duration;

    return (
        <div className="PlayBar">
            <div className="PlayBar__detail">
                <div className="PlayBar__title">{currentSong.title}</div>
                <div className="PlayBar__time">
                    {displayCurrentTime} / {displayTotalTime}
                </div>
            </div>
            <div className="PlayBar__controls">
                <button className="PlayBar__previous" disabled={currentSongIndex === 0} onClick={navigatePrevious}>
                    <PreviousIcon size={24} />
                </button>
                <button className="PlayBar__play" onClick={togglePlay}>
                    {isPlaying ? <PauseIcon size={32} /> : <PlayIcon size={32} />}
                </button>
                <button
                    className="PlayBar__next"
                    disabled={currentSongIndex === SONGS.length - 1}
                    onClick={navigateNext}
                >
                    <NextIcon size={24} />
                </button>
            </div>
            <div className="PlayBar__progress-bar" ref={progressBarRef} onMouseDown={handleProgressMouseDown}>
                <div className="PlayBar__progress" style={{ width: `${progress * 100}%` }} />
            </div>
        </div>
    );
};

export default PlayBar;

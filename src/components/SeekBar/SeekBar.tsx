import React, { useEffect, useRef } from 'react';
import './SeekBar.css';

interface SeekBarProps {
    onEndSeek?: (value: number) => void;
    onSeek?: (value: number) => void;
    onStartSeek?: (value: number) => void;
    value: number;
}

const SeekBar: React.FC<SeekBarProps> = ({ onEndSeek, onSeek, onStartSeek, value }) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const dragStateRef = useRef({ isDragging: false });

    const handleProgressMouseDown: React.MouseEventHandler = (event) => {
        event.preventDefault();
        if (!onStartSeek || !rootRef.current) {
            return;
        }
        
        dragStateRef.current.isDragging = true;

        const { clientX } = event;
        const { x, width } = rootRef.current.getBoundingClientRect();
        const targetValue = Math.max(0, Math.min(1, (clientX - x) / width));
        onStartSeek(targetValue);
    };

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (!onSeek || !rootRef.current || !dragStateRef.current.isDragging) {
                return;
            }

            const { clientX } = event;
            const { x, width } = rootRef.current.getBoundingClientRect();
            const targetValue = Math.max(0, Math.min(1, (clientX - x) / width));
            onSeek(targetValue);
        };

        const handleMouseUp = (event: MouseEvent) => {
            if (!onEndSeek || !rootRef.current || !dragStateRef.current.isDragging) {
                return;
            }
            dragStateRef.current.isDragging = false;
    
            const { clientX } = event;
            const { x, width } = rootRef.current.getBoundingClientRect();
            const targetValue = Math.max(0, Math.min(1, (clientX - x) / width));
            onEndSeek(targetValue);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [onEndSeek, onSeek]);

    return (
        <div className="SeekBar" ref={rootRef} onMouseDown={handleProgressMouseDown}>
            <div className="SeekBar__progress" style={{ width: `${value * 100}%` }} />
        </div>
    );
};

export default SeekBar;

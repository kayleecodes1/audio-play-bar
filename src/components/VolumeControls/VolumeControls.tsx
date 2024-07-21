import React, { useEffect, useRef, useState } from 'react';
import { Volume as VolumeIcon, VolumeMute as VolumeMuteIcon } from '../icons';
import './VolumeControls.css';

interface VolumeControlsProps {
    onChange?: (value: number) => void;
    value: number;
}

const VolumeControls: React.FC<VolumeControlsProps> = ({ onChange, value }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const dialogRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLDivElement | null>(null);
    const sliderBarRef = useRef<HTMLDivElement | null>(null);

    const handleClick: React.MouseEventHandler = (event) => {
        event.preventDefault();
        setIsDialogOpen((prevState) => !prevState);
    };

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            event.preventDefault();
            if (!buttonRef.current || buttonRef.current.contains(event.target as Node)) {
                return;
            }
            if (!dialogRef.current || dialogRef.current.contains(event.target as Node)) {
                return;
            }
            if (dragStateRef.current.isDragging) {
                return;
            }
            setIsDialogOpen(false);
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

    const dragStateRef = useRef({
        isDragging: false,
    });

    const handleMouseDown: React.MouseEventHandler = (event) => {
        event.preventDefault();
        if (!sliderBarRef.current || !onChange) {
            return;
        }

        dragStateRef.current.isDragging = true;

        const { clientY } = event;
        const { y, height } = sliderBarRef.current.getBoundingClientRect();
        const targetVolume = 1 - Math.max(0, Math.min(1, (clientY - y) / height));
        onChange(targetVolume);
    };

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (!dragStateRef.current.isDragging || !sliderBarRef.current || !onChange) {
                return;
            }

            const { clientY } = event;
            const { y, height } = sliderBarRef.current.getBoundingClientRect();
            const targetVolume = 1 - Math.max(0, Math.min(1, (clientY - y) / height));
            onChange(targetVolume);
        };

        const handleMouseUp = (event: MouseEvent) => {
            event.preventDefault();
            if (dragStateRef.current.isDragging) {
                setTimeout(() => {
                    dragStateRef.current.isDragging = false;
                }, 0);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [onChange]);

    return (
        <div className="VolumeControls">
            <div className="VolumeControls__button" onClick={handleClick} ref={buttonRef}>
                {value === 0 ? <VolumeMuteIcon size={24} /> : <VolumeIcon size={24} />}
            </div>
            {isDialogOpen && (
                <div className="VolumeControls__dialog" ref={dialogRef}>
                    <div className="VolumeControls__slider-bar" onMouseDown={handleMouseDown} ref={sliderBarRef}>
                        <div className="VolumeControls__slider" style={{ height: `${value * 100}%` }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolumeControls;

import React from 'react';
import './Icon.css';

export interface BaseIconProps {
    size?: number;
}

const createIcon = (path: string, displayName: string) => {
    const Icon = React.memo(({ size }: BaseIconProps) => (
        <svg className="Icon" width={size} height={size} viewBox="0 0 24 24">
            <path d={path} />
        </svg>
    ));
    Icon.displayName = displayName;
    return Icon;
};

export default createIcon;

import { useState, useEffect } from 'react';

export const isWiderThanHigher = (
    // height:number|null, width:number|null
) => {
    const { height, width } = useWindowDimensions();
    // return true;
    if (typeof height === "number") {
        if (typeof width === "number") {
            return width > height;
        }
    }
    return false;
}

function useWindowDimensions() {

    const hasWindow = typeof window !== 'undefined';

    function getWindowDimensions() {
        const width = hasWindow ? window.innerWidth : null;
        const height = hasWindow ? window.innerHeight : null;
        return {
            width,
            height,
        };
    }

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(
        () => {
            if (hasWindow) {
                function handleResize() {
                    setWindowDimensions(getWindowDimensions());
                }
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
        },
        [hasWindow]
    );

    return windowDimensions;
}
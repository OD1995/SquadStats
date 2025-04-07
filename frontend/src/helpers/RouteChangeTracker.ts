import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "./analytics";

export const RouteChangeTracker = () => {

    const location = useLocation();

    useEffect(
        () => {
            const pagePath = location.pathname + location.search;
            ReactGA.send({ hitType: "pageview", page: pagePath });
        },
        [location]
    );
    
    return null;
};
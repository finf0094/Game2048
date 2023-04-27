import {useEffect} from "react";

export const useEvent = (event, handler, passive = false) => {
    useEffect(() => {
        window.addEventListener(event, handler, passive);

        return function cleanUp() {
            window.removeEventListener(event,handler);
        };
    });
};

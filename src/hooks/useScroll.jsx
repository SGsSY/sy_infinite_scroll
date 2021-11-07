import { useRef, useEffect } from "react";

const useScroll = (callBack) => {
    const ref = useRef(null);

    useEffect(() => {
        const refCur = ref.current;

        if (ref.current && callBack) {
            ref.current.addEventListener('scroll', callBack);
        }

        return () => {
            if (refCur && callBack) {
                refCur.removeEventListener('scroll', callBack);
            }
        };
    }, [ref, callBack]);

    return ref;
}

export default useScroll;
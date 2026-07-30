import { useState, useEffect, useRef } from "react";
function useTimer(seconds, onExpire, resetKey) {
    const [timeLeft, setTimeLeft] = useState(seconds)
    const onExpireRef = useRef(onExpire)
    onExpireRef.current = onExpire;
    useEffect(() => {
        setTimeLeft(seconds);
        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000);
        return () => clearInterval(interval)
    }, [resetKey, seconds]);
    useEffect(() => {
        if (timeLeft === 0) onExpireRef.current()
    }, [timeLeft]);
    return timeLeft;
    
}
export default useTimer;

    export function isTouchDevice() {
        return (
            "ontouchstart" in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 1)
        )
    }
    
    export function isAndroid() {
        if (typeof navigator === "undefined") return false;
        const userAgent = navigator.userAgent.toLowerCase();
        console.log(userAgent);
        return userAgent.includes("android") && isTouchDevice();
    };
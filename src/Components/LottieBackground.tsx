import { useEffect, useRef } from 'react';
import animationData from '../assets/darkTheme.json';

export default function LottieBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<any>(null);

    useEffect(() => {
        const loadLottie = () => {
            if (containerRef.current && (window as any).lottie) {
                if (animRef.current) {
                    animRef.current.destroy();
                }
                animRef.current = (window as any).lottie.loadAnimation({
                    container: containerRef.current,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    animationData: animationData,
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                });
            }
        };

        if (!(window as any).lottie) {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
            script.async = true;
            script.onload = loadLottie;
            document.body.appendChild(script);
        } else {
            loadLottie();
        }

        return () => {
            if (animRef.current) {
                animRef.current.destroy();
            }
        };
    }, []);

    return <div ref={containerRef} className="w-full h-full pointer-events-none z-0" style={{ opacity: 0.8 }} />;
}

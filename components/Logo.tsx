export function Logo({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan */}
                    <stop offset="100%" stopColor="#8b5cf6" /> {/* Violet */}
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Outer Triangle (Dimension) */}
            <path
                d="M50 15 L85 80 L15 80 Z"
                stroke="url(#eyeGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                className="animate-pulse"
            />

            {/* Inner Eye */}
            <path
                d="M30 60 Q50 30 70 60 Q50 90 30 60 Z"
                stroke="white"
                strokeWidth="3"
                fill="rgba(255,255,255,0.1)"
            />
            <circle cx="50" cy="60" r="6" fill="#f59e0b" filter="url(#glow)" />
        </svg>
    );
}

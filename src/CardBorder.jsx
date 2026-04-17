import { useId } from 'react';

// Dot pattern SVG background
function DotPattern({ width = 5, height = 5 }) {
    const id = useId();
    return (
        <svg
            aria-hidden="true"
            style={{
                pointerEvents: 'none',
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                fill: 'rgba(255,255,255,0.12)',
            }}
        >
            <defs>
                <pattern
                    id={id}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    patternContentUnits="userSpaceOnUse"
                >
                    <circle cx="0.5" cy="0.5" r="0.5" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
        </svg>
    );
}

// Corner squares
const CORNER = {
    topLeft:     { top: 0,    left: 0  },
    topRight:    { top: 0,    right: 0 },
    bottomLeft:  { bottom: 0, left: 0  },
    bottomRight: { bottom: 0, right: 0 },
};

function CornerSquares({ color = 'var(--accent)' }) {
    return (
        <>
            {Object.values(CORNER).map((pos, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: 6,
                        height: 6,
                        background: color,
                        ...pos,
                    }}
                />
            ))}
        </>
    );
}

// Main component — drop inside any card
export default function CardBorder({ dotColor, cornerColor }) {
    return (
        <>
            <DotPattern />
            <CornerSquares color={cornerColor} />
        </>
    );
}

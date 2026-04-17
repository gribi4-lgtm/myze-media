import { motion } from 'framer-motion';

const nodes = Array.from({ length: 50 }, (_, i) => ({
    x: Math.random() * 800,
    y: Math.random() * 600,
    id: `node-${i}`,
}));

const connections = [];
nodes.forEach((node, i) => {
    nodes.forEach((other, j) => {
        if (i >= j) return;
        const distance = Math.sqrt(Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2));
        if (distance < 120 && Math.random() > 0.6) {
            connections.push({
                id: `conn-${i}-${j}`,
                d: `M${node.x},${node.y} L${other.x},${other.y}`,
                delay: Math.random() * 10,
            });
        }
    });
});

export default function AnimatedBackground() {
    return (
        <div style={{ position: 'absolute', inset: 0, color: '#ffffff' }}>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.75 }} viewBox="0 0 800 600">
                {connections.map((conn) => (
                    <motion.path
                        key={conn.id}
                        d={conn.d}
                        stroke="currentColor"
                        strokeWidth="0.5"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: [0, 1, 0], opacity: [0, 0.8, 0] }}
                        transition={{ duration: 6, delay: conn.delay, repeat: Infinity, ease: 'easeInOut' }}
                    />
                ))}
                {nodes.map((node) => (
                    <motion.circle
                        key={node.id}
                        cx={node.x}
                        cy={node.y}
                        r="2"
                        fill="currentColor"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1, 1.2, 1], opacity: [0, 0.6, 0.8, 0.6] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                ))}
            </svg>
        </div>
    );
}

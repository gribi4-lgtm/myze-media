import { useEffect, useRef } from 'react';

export function Entropy({ style = {}, className = '' }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        let W = container.clientWidth;
        let H = container.clientHeight;

        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = `${W}px`;
        canvas.style.height = `${H}px`;
        ctx.scale(dpr, dpr);

        const particleColor = '#ffffff';

        class Particle {
            constructor(x, y, order) {
                this.x = x;
                this.y = y;
                this.originalX = x;
                this.originalY = y;
                this.size = 1.5;
                this.order = order;
                this.velocity = {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2,
                };
                this.influence = 0;
                this.neighbors = [];
            }

            update() {
                if (this.order) {
                    const dx = this.originalX - this.x;
                    const dy = this.originalY - this.y;
                    const chaosInfluence = { x: 0, y: 0 };
                    this.neighbors.forEach(neighbor => {
                        if (!neighbor.order) {
                            const distance = Math.hypot(this.x - neighbor.x, this.y - neighbor.y);
                            const strength = Math.max(0, 1 - distance / 100);
                            chaosInfluence.x += neighbor.velocity.x * strength;
                            chaosInfluence.y += neighbor.velocity.y * strength;
                            this.influence = Math.max(this.influence, strength);
                        }
                    });
                    this.x += dx * 0.05 * (1 - this.influence) + chaosInfluence.x * this.influence;
                    this.y += dy * 0.05 * (1 - this.influence) + chaosInfluence.y * this.influence;
                    this.influence *= 0.99;
                } else {
                    this.velocity.x += (Math.random() - 0.5) * 0.5;
                    this.velocity.y += (Math.random() - 0.5) * 0.5;
                    this.velocity.x *= 0.95;
                    this.velocity.y *= 0.95;
                    this.x += this.velocity.x;
                    this.y += this.velocity.y;

                    if (this.x < W / 2 || this.x > W) this.velocity.x *= -1;
                    if (this.y < 0 || this.y > H) this.velocity.y *= -1;
                    this.x = Math.max(W / 2, Math.min(W, this.x));
                    this.y = Math.max(0, Math.min(H, this.y));
                }
            }

            draw() {
                const alpha = this.order ? 0.8 - this.influence * 0.5 : 0.8;
                ctx.fillStyle = `${particleColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const particles = [];
        const cols = 30;
        const rows = 20;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = (W / cols) * i + W / cols / 2;
                const y = (H / rows) * j + H / rows / 2;
                particles.push(new Particle(x, y, x < W / 2));
            }
        }

        function updateNeighbors() {
            particles.forEach(p => {
                p.neighbors = particles.filter(other => {
                    if (other === p) return false;
                    return Math.hypot(p.x - other.x, p.y - other.y) < 100;
                });
            });
        }

        let time = 0;
        let animationId;

        function animate() {
            ctx.clearRect(0, 0, W, H);

            if (time % 30 === 0) updateNeighbors();

            particles.forEach(p => {
                p.update();
                p.draw();
                p.neighbors.forEach(neighbor => {
                    const distance = Math.hypot(p.x - neighbor.x, p.y - neighbor.y);
                    if (distance < 50) {
                        const alpha = 0.2 * (1 - distance / 50);
                        ctx.strokeStyle = `${particleColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(neighbor.x, neighbor.y);
                        ctx.stroke();
                    }
                });
            });

            // Dividing line
            ctx.strokeStyle = `${particleColor}33`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(W / 2, 0);
            ctx.lineTo(W / 2, H);
            ctx.stroke();

            time++;
            animationId = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{ position: 'absolute', inset: 0, ...style }}
        >
            <canvas
                ref={canvasRef}
                style={{ display: 'block', width: '100%', height: '100%' }}
            />
        </div>
    );
}

export default Entropy;

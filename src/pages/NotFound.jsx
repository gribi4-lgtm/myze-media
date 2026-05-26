import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { usePageMeta, siteUrl } from '../utils/meta';
import { revealVariants, revealTransition } from '../utils/animation';

export default function NotFound() {
  const shouldReduceMotion = useReducedMotion();
  const activeRv = shouldReduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : revealVariants;

  usePageMeta({
    title: 'Page Not Found — MYZE Media',
    description: 'The page you are looking for could not be found.',
    url: `${siteUrl}/404`,
  });

  return (
    <main className="not-found-page">
      <motion.div
        variants={activeRv}
        initial="hidden"
        animate="visible"
        transition={revealTransition}
      >
        <span className="work-eyebrow">404</span>
        <h1>Page not found.</h1>
        <p>The page may have moved, or the link may be outdated.</p>
        <Link to="/" className="btn-outline">RETURN HOME</Link>
      </motion.div>
    </main>
  );
}

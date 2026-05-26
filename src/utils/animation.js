export const revealVariants = {
  hidden:  { opacity: 0, y: 18, filter: 'blur(5px)' },
  visible: { opacity: 1, y: 0,  filter: 'none' },
};

export const imageVariants = {
  hidden:  { opacity: 0, scale: 1.04, filter: 'blur(8px)' },
  visible: { opacity: 1, scale: 1,    filter: 'none' },
};

export const revealTransition  = { duration: 1.2, ease: [0.22, 1, 0.36, 1] };
export const imageTransition   = { duration: 1.8, ease: [0.22, 1, 0.36, 1] };
export const viewportOnce      = { once: true, amount: 0.2 };

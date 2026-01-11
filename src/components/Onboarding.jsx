import React, { useState, useEffect } from 'react';
import styles from '../styles/components/Onboarding.module.css';

const STEPS = [
  {
    title: 'Welcome to Neuro-Chain',
    description: 'Explore the global innovation network visualization. Discover connections between technologies, clusters, and future trends.',
    emoji: '🌐'
  },
  {
    title: 'Navigate the Network',
    description: 'Click and drag to pan across the universe of ideas. Scroll or pinch to zoom in for details or out for the big picture.',
    emoji: '🖱️'
  },
  {
    title: 'Discover Insights',
    description: 'Hover over nodes to see connections. Click on any node to focus and explore its specific cluster relationships.',
    emoji: '🔍'
  },
  {
    title: 'Filter & Analyze',
    description: 'Use the legend on the right to toggle clusters. View network statistics to understand the ecosystem\'s growth and density.',
    emoji: '📊'
  }
];

const Onboarding = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('neuro-chain-onboarding-seen');
    if (!hasSeenOnboarding) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('neuro-chain-onboarding-seen', 'true');
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  if (!isVisible) return null;

  const step = STEPS[currentStep];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.imagePlaceholder}>
          {step.emoji}
        </div>
        
        <div className={styles.content}>
          <h2 className={styles.title}>{step.title}</h2>
          <p className={styles.description}>{step.description}</p>
        </div>

        <div className={styles.footer}>
          <div className={styles.dots}>
            {STEPS.map((_, index) => (
              <div 
                key={index} 
                className={`${styles.dot} ${index === currentStep ? styles.dotActive : ''}`}
              />
            ))}
          </div>

          <div className={styles.buttons}>
            <button className={styles.skipButton} onClick={handleComplete}>
              Skip
            </button>
            <button className={styles.nextButton} onClick={handleNext}>
              {currentStep === STEPS.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

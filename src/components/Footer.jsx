import React from 'react';
import styles from '../styles/components/Footer.module.css';

const Footer = React.memo(() => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.brand}>
          <span className={styles.brandName}>Bude Global</span>
          <span className={styles.separator}>•</span>
          <span className={styles.tagline}>Visualizing Innovation Networks</span>
        </div>
        <div className={styles.links}>
          <a href="https://budeglobal.com" target="_blank" rel="noopener noreferrer" className={styles.link}>
            Website
          </a>
          <span className={styles.separator}>•</span>
          <a href="mailto:contact@budeglobal.com" className={styles.link}>
            Contact
          </a>
        </div>
      </div>
    </div>
  );
});

Footer.displayName = 'Footer';

export default Footer;

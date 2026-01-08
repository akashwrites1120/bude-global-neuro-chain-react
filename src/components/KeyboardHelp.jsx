import React, { useState } from 'react';
import styles from '../styles/components/KeyboardHelp.module.css';

const KeyboardHelp = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { keys: ['Ctrl', 'K'], description: 'Focus search bar' },
    { keys: ['Esc'], description: 'Close search/modals' },
    { keys: ['Space'], description: 'Pause/Resume animation' },
    { keys: ['R'], description: 'Reset view to center' },
    { keys: ['↑', '↓', '←', '→'], description: 'Pan camera' },
    { keys: ['?'], description: 'Toggle this help panel' },
    { keys: ['+', '-'], description: 'Zoom in/out' },
  ];

  return (
    <>
      <button
        className={styles.helpButton}
        onClick={() => setIsOpen(!isOpen)}
        title="Keyboard Shortcuts (Press ?)"
      >
        ?
      </button>

      {isOpen && (
        <div className={styles.helpModal}>
          <div className={styles.helpContent}>
            <div className={styles.helpHeader}>
              <h3>Keyboard Shortcuts</h3>
              <button
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.shortcutList}>
              {shortcuts.map((shortcut, index) => (
                <div key={index} className={styles.shortcutItem}>
                  <div className={styles.keys}>
                    {shortcut.keys.map((key, i) => (
                      <React.Fragment key={i}>
                        <kbd className={styles.key}>{key}</kbd>
                        {i < shortcut.keys.length - 1 && (
                          <span className={styles.plus}>+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className={styles.description}>{shortcut.description}</div>
                </div>
              ))}
            </div>

            <div className={styles.helpFooter}>
              <span className={styles.tip}>
                💡 Tip: Hover over buttons to see more shortcuts
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

KeyboardHelp.displayName = 'KeyboardHelp';

export default KeyboardHelp;

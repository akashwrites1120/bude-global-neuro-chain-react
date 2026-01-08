import React, { useState, useMemo } from 'react';
import styles from '../styles/components/SearchBar.module.css';

const SearchBar = React.memo(({ nodes, onNodeSelect, clusters, inputRef }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredNodes = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return nodes
      .filter(node => 
        node.label.toLowerCase().includes(term) ||
        node.id.toLowerCase().includes(term) ||
        clusters[node.cluster]?.label.toLowerCase().includes(term)
      )
      .slice(0, 10); // Limit to 10 results
  }, [searchTerm, nodes, clusters]);

  const handleSelect = (node) => {
    onNodeSelect(node);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchBox}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          ref={inputRef}
          type="text"
          className={styles.searchInput}
          placeholder="Search innovations..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        {searchTerm && (
          <button
            className={styles.clearBtn}
            onClick={() => {
              setSearchTerm('');
              setIsOpen(false);
            }}
          >
            ×
          </button>
        )}
      </div>

      {isOpen && filteredNodes.length > 0 && (
        <div className={styles.searchResults}>
          {filteredNodes.map(node => (
            <div
              key={node.id}
              className={styles.searchResult}
              onClick={() => handleSelect(node)}
            >
              <div className={styles.resultLabel}>{node.label}</div>
              <div className={styles.resultCluster}>
                <span
                  className={styles.resultDot}
                  style={{ backgroundColor: clusters[node.cluster]?.color }}
                />
                {clusters[node.cluster]?.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;

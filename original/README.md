# Bude Global Neuro-Chain - Original HTML Versions

This directory contains the original HTML implementations that served as the foundation for the React version.

## Files

### neuro-chain-v1.html
- **Size**: ~35 KB
- **Description**: First version of the neuro-chain visualization
- **Features**: Basic network visualization with canvas rendering
- **Data**: Embedded in HTML

### neuro-chain-v2.html
- **Size**: ~49 KB
- **Description**: Enhanced version with improved UI and animations
- **Features**: 
  - Advanced canvas rendering
  - Smooth animations
  - Interactive tooltips
  - Panel with cluster descriptions
  - Data editor
- **Data**: Embedded in HTML (later extracted to JSON)

## Purpose

These files are kept for:
1. **Reference**: Original implementation details
2. **Documentation**: Understanding the evolution
3. **Comparison**: Pixel-perfect conversion verification
4. **Backup**: Fallback if needed

## Usage

Simply open these files in a web browser:
```bash
# Windows
start neuro-chain-v2.html

# Mac
open neuro-chain-v2.html

# Linux
xdg-open neuro-chain-v2.html
```

## Migration to React

The React version (`../src/`) was created by:
1. Extracting all data to JSON files (`src/data/`)
2. Converting HTML/CSS to React components
3. Refactoring JavaScript to React hooks
4. Adding new features (keyboard shortcuts, minimap, export, etc.)
5. Optimizing for performance and scalability

## Differences

| Feature | HTML Version | React Version |
|---------|--------------|---------------|
| **Data** | Embedded | Separate JSON files |
| **Styling** | Global CSS | CSS Modules |
| **State** | Vanilla JS | React hooks |
| **Performance** | Basic | Optimized (viewport culling, LOD) |
| **Features** | Core only | +Keyboard shortcuts, minimap, export, stats |
| **Mobile** | Basic | Touch gestures |
| **Deployment** | Single file | Build process |

## License

Same as main project (MIT)

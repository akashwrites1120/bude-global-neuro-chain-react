/**
 * Security Configuration Module
 * Provides security utilities including DOMPurify config, input validation, and rate limiting
 */

import DOMPurify from 'dompurify';

/**
 * Strict DOMPurify configuration for HTML sanitization
 */
export const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ['strong', 'em', 'br', 'a', 'ul', 'ol', 'li', 'p', 'span', 'code'],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'javascript'],
  KEEP_CONTENT: true,
  ADD_ATTR: ['target'],
  FORCE_BODY: true,
};

/**
 * Sanitize HTML content using DOMPurify with strict config
 * @param {string} dirty - Untrusted HTML content
 * @returns {string} Sanitized HTML
 */
export const sanitizeHTML = (dirty) => {
  if (!dirty || typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, SANITIZE_CONFIG);
};

/**
 * Validate JSON data against expected schema
 * @param {object} data - Data to validate
 * @param {string} schemaType - Type of schema: 'nodes', 'edges', 'clusters', 'descriptions'
 * @returns {{valid: boolean, errors: string[]}}
 */
export const validateDataSchema = (data, schemaType) => {
  const errors = [];

  switch (schemaType) {
    case 'nodes':
      if (!Array.isArray(data)) {
        errors.push('Nodes must be an array');
        break;
      }
      data.forEach((node, i) => {
        if (!node.id) errors.push(`Node ${i}: missing id`);
        if (!node.label) errors.push(`Node ${i}: missing label`);
        if (!node.cluster) errors.push(`Node ${i}: missing cluster`);
        if (typeof node.x !== 'number') errors.push(`Node ${i}: x must be a number`);
        if (typeof node.y !== 'number') errors.push(`Node ${i}: y must be a number`);
        if (typeof node.size !== 'number' || node.size <= 0) {
          errors.push(`Node ${i}: size must be a positive number`);
        }
      });
      break;

    case 'edges':
      if (!Array.isArray(data)) {
        errors.push('Edges must be an array');
        break;
      }
      data.forEach((edge, i) => {
        if (!edge.source) errors.push(`Edge ${i}: missing source`);
        if (!edge.target) errors.push(`Edge ${i}: missing target`);
        if (!['forward', 'backlink'].includes(edge.type)) {
          errors.push(`Edge ${i}: type must be 'forward' or 'backlink'`);
        }
      });
      break;

    case 'clusters':
      if (typeof data !== 'object' || Array.isArray(data)) {
        errors.push('Clusters must be an object');
        break;
      }
      Object.entries(data).forEach(([key, cluster]) => {
        if (!cluster.color) errors.push(`Cluster ${key}: missing color`);
        if (!cluster.label) errors.push(`Cluster ${key}: missing label`);
      });
      break;

    case 'descriptions':
      if (typeof data !== 'object' || Array.isArray(data)) {
        errors.push('Descriptions must be an object');
        break;
      }
      Object.entries(data).forEach(([key, desc]) => {
        if (!desc.title) errors.push(`Description ${key}: missing title`);
        if (!desc.body) errors.push(`Description ${key}: missing body`);
      });
      break;

    default:
      errors.push(`Unknown schema type: ${schemaType}`);
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Rate limiter for expensive operations
 */
class RateLimiter {
  constructor(maxCalls, windowMs) {
    this.maxCalls = maxCalls;
    this.windowMs = windowMs;
    this.calls = [];
  }

  canProceed() {
    const now = Date.now();
    this.calls = this.calls.filter(time => now - time < this.windowMs);
    
    if (this.calls.length >= this.maxCalls) {
      return false;
    }
    
    this.calls.push(now);
    return true;
  }

  reset() {
    this.calls = [];
  }
}

// Export rate limiter (5 exports per minute)
export const exportRateLimiter = new RateLimiter(5, 60000);

// Data update rate limiter (20 updates per minute)
export const updateRateLimiter = new RateLimiter(20, 60000);

/**
 * Maximum content lengths for validation
 */
export const MAX_LENGTHS = {
  nodeLabel: 100,
  nodeId: 50,
  descriptionBody: 5000,
  descriptionTitle: 200,
  clusterLabel: 100,
  jsonContent: 1000000, // 1MB
};

/**
 * Validate content length
 * @param {string} content - Content to validate
 * @param {string} type - Type of content (key from MAX_LENGTHS)
 * @returns {boolean}
 */
export const validateLength = (content, type) => {
  const maxLength = MAX_LENGTHS[type];
  if (!maxLength) return true;
  return typeof content === 'string' && content.length <= maxLength;
};

/**
 * Content Security Policy configuration for meta tag
 * Note: Headers should be set at server/CDN level for production
 */
export const CSP_POLICY = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"], // Needed for Vite HMR in dev
  'style-src': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
  'font-src': ["'self'", 'fonts.gstatic.com'],
  'img-src': ["'self'", 'data:', 'blob:'],
  'connect-src': ["'self'", 'ws:', 'wss:'], // WebSocket for HMR
};

export const generateCSPString = () => {
  return Object.entries(CSP_POLICY)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

export default {
  sanitizeHTML,
  validateDataSchema,
  validateLength,
  exportRateLimiter,
  updateRateLimiter,
  MAX_LENGTHS,
  CSP_POLICY,
  generateCSPString,
};

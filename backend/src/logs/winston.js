/**
 * src/logs/winston.js
 * Centralized logger using the built-in console.
 * (Install `winston` package for production-grade log rotation & transports)
 *
 * Usage:
 *   import logger from '../logs/winston.js';
 *   logger.info('Server started');
 *   logger.error('Something broke', error);
 */

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const COLORS = { error: '\x1b[31m', warn: '\x1b[33m', info: '\x1b[36m', debug: '\x1b[90m', reset: '\x1b[0m' };

function shouldLog(level) {
  return LEVELS[level] <= LEVELS[LOG_LEVEL];
}

function format(level, message, extra) {
  const ts = new Date().toISOString();
  const color = COLORS[level] || '';
  const tag = `[${level.toUpperCase()}]`;
  const base = `${COLORS.reset}${ts} ${color}${tag}${COLORS.reset} ${message}`;
  return extra ? `${base}\n${JSON.stringify(extra, null, 2)}` : base;
}

const logger = {
  error: (msg, extra) => shouldLog('error') && console.error(format('error', msg, extra)),
  warn:  (msg, extra) => shouldLog('warn')  && console.warn(format('warn', msg, extra)),
  info:  (msg, extra) => shouldLog('info')  && console.info(format('info', msg, extra)),
  debug: (msg, extra) => shouldLog('debug') && console.debug(format('debug', msg, extra))
};

export default logger;

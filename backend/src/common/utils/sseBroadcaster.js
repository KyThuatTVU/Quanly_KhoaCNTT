/**
 * ==========================================================================
 * BACKEND REAL-TIME SERVER-SENT EVENTS (SSE) BROADCASTER
 * ==========================================================================
 * Maintains persistent HTTP stream connections with active public clients.
 * Whenever an Admin creates, edits, or deletes any entity data, this module
 * broadcasts a real-time event to all connected browsers in < 0.05 seconds.
 */

import logger from '../../logs/winston.js';

const sseClients = new Set();

// Send periodic heartbeat every 25 seconds to keep HTTP connections alive through Nginx/Proxies
setInterval(() => {
  if (sseClients.size === 0) return;
  const heartbeatMessage = `data: ${JSON.stringify({ type: 'HEARTBEAT', timestamp: Date.now() })}\n\n`;
  sseClients.forEach(res => {
    try {
      res.write(heartbeatMessage);
    } catch (err) {
      sseClients.delete(res);
    }
  });
}, 25000);

export const sseBroadcaster = {
  /**
   * HTTP Stream Handler for GET /api/v1/public/events
   */
  subscribeClient(req, res) {
    // Disable HTTP request timeout for persistent SSE streams
    req.setTimeout(0);
    res.setTimeout(0);

    // Set headers required for Server-Sent Events (SSE)
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no' // Disable proxy buffering for Nginx
    });

    // Send initial handshake event
    const handshakeData = `data: ${JSON.stringify({ type: 'CONNECTED', timestamp: Date.now() })}\n\n`;
    res.write(handshakeData);

    // Add connection to active clients set
    sseClients.add(res);

    // Clean up when client disconnects or closes tab
    const cleanup = () => {
      sseClients.delete(res);
      try {
        res.end();
      } catch (e) {
        // Ignore
      }
    };

    req.on('close', cleanup);
    req.on('end', cleanup);
    res.on('error', cleanup);
  },

  /**
   * Broadcast real-time data update event to all connected public clients
   * @param {string} entity - Name of updated entity (e.g. 'undergradPrograms', 'staff', 'news')
   * @param {string} action - Action type ('create', 'update', 'delete')
   * @param {Object} [data] - Optional payload
   */
  broadcastDataUpdate(entity, action, data = null) {
    if (sseClients.size === 0) return;

    const payload = {
      type: 'DATA_UPDATED',
      entity,
      action,
      timestamp: Date.now()
    };

    const sseMessage = `data: ${JSON.stringify(payload)}\n\n`;
    logger.info(`📡 [SSE Broadcaster] Emitting Real-Time update to ${sseClients.size} client(s) for entity: ${entity} (${action})`);

    sseClients.forEach(res => {
      try {
        res.write(sseMessage);
      } catch (err) {
        sseClients.delete(res);
      }
    });
  },

  /**
   * Get total active connected clients
   */
  getActiveClientCount() {
    return sseClients.size;
  }
};

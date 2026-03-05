import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import path from 'path';

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  const PORT = 3000;

  // Store current overlay state
  let overlayState = {
    theme: {
      primary: '#10b981',
      secondary: '#064e3b',
      text: '#ffffff',
      accent: '#fbbf24',
    },
    widgets: {
      socials: {
        enabled: true,
        twitter: '@streamer',
        instagram: 'streamer_life',
        youtube: 'StreamerChannel',
      },
      logo: {
        enabled: true,
        url: 'https://vwqbifrslmaxymferwyr.supabase.co/storage/v1/object/public/images/1772712401766-clb9i6jetn.png',
      },
      goal: {
        enabled: true,
        title: 'Sub Goal',
        current: 450,
        target: 500,
      },
      nowPlaying: {
        enabled: true,
        text: 'Lofi Hip Hop Radio - Beats to relax/study to',
      },
      clock: {
        enabled: true,
      },
      weather: {
        enabled: true,
        location: 'Yerevan, Kentron',
      },
      alerts: {
        lastSubscriber: 'User123',
        lastDonation: '$50.00',
      },
    },
  };

  wss.on('connection', (ws) => {
    console.log('New client connected');

    // Send initial state
    ws.send(JSON.stringify({ type: 'INIT', state: overlayState }));

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === 'UPDATE_STATE') {
          overlayState = { ...overlayState, ...data.state };
          // Broadcast to all clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'STATE_UPDATED', state: overlayState }));
            }
          });
        }

        if (data.type === 'TRIGGER_ALERT') {
          // Broadcast alert to all clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'ALERT', alert: data.alert }));
            }
          });
        }
      } catch (e) {
        console.error('Error processing message:', e);
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

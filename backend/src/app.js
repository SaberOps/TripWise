
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

import destinationRoutes from './routes/destination.routes.js';
import tripRoutes from './routes/trip.routes.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:4200'
}));

app.use(express.json());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TRIPWISE API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/destinations', destinationRoutes);
app.use('/api/trips', tripRoutes);

export default app;


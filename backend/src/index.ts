import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import healthRouter from './routes/health';
import authRouter from './routes/auth';
import projectsRouter from './routes/projects';
import { errorHandler } from './middleware/error-handler';

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`SP Associates Backend running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

export default app;

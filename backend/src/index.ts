import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import usersRouter from './routes/users';
import reunionesRouter from './routes/reuniones';
import horariosRouter from './routes/horarios';
import modulosRouter from './routes/modulos';
import ciclosRouter from './routes/ciclos';
import matriculacionesRouter from './routes/matriculaciones';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/public', express.static(path.join(__dirname, '../../public')));

app.use('/api/users', usersRouter);
app.use('/api/reuniones', reunionesRouter);
app.use('/api/horarios', horariosRouter);
app.use('/api/modulos', modulosRouter);
app.use('/api/ciclos', ciclosRouter);
app.use('/api/matriculaciones', matriculacionesRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ElorServ API está funcionando' });
});

AppDataSource.initialize()
  .then(() => {
    console.log('✅ Conexión a MySQL establecida correctamente');
    
    app.listen(PORT, () => {
      console.log(`🚀 ElorServ corriendo en http://localhost:${PORT}`);
      console.log(`📚 API disponible en http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar con la base de datos:', error);
  });

import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Matriculacion } from '../entities/Matriculacion';

const router = Router();
const matriculacionRepository = () => AppDataSource.getRepository(Matriculacion);

// GET /api/matriculaciones - Obtener todas las matriculaciones
router.get('/', async (req, res) => {
  try {
    const matriculaciones = await matriculacionRepository().find({
      relations: ['alumno', 'ciclo'],
      order: { fecha: 'DESC' },
    });
    res.json(matriculaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener matriculaciones' });
  }
});

// GET /api/matriculaciones/alumno/:id - Obtener matriculaciones de un alumno
router.get('/alumno/:id', async (req, res) => {
  try {
    const matriculaciones = await matriculacionRepository().find({
      where: { alum_id: parseInt(req.params.id) },
      relations: ['ciclo'],
      order: { fecha: 'DESC' },
    });
    res.json(matriculaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener matriculaciones del alumno' });
  }
});

// GET /api/matriculaciones/ciclo/:id - Obtener matriculaciones de un ciclo
router.get('/ciclo/:id', async (req, res) => {
  try {
    const matriculaciones = await matriculacionRepository().find({
      where: { ciclo_id: parseInt(req.params.id) },
      relations: ['alumno', 'ciclo'],
      order: { fecha: 'DESC' },
    });
    res.json(matriculaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener matriculaciones del ciclo' });
  }
});

// GET /api/matriculaciones/:id - Obtener matriculación por ID
router.get('/:id', async (req, res) => {
  try {
    const matriculacion = await matriculacionRepository().findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['alumno', 'ciclo'],
    });

    if (!matriculacion) {
      return res.status(404).json({ error: 'Matriculación no encontrada' });
    }

    res.json(matriculacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener matriculación' });
  }
});

// POST /api/matriculaciones - Crear matriculación
router.post('/', async (req, res) => {
  try {
    const { alum_id, ciclo_id, curso, fecha } = req.body;

    const newMatriculacion = matriculacionRepository().create({
      alum_id,
      ciclo_id,
      curso,
      fecha: new Date(fecha),
    });

    await matriculacionRepository().save(newMatriculacion);
    res.status(201).json(newMatriculacion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear matriculación' });
  }
});

// DELETE /api/matriculaciones/:id - Eliminar matriculación
router.delete('/:id', async (req, res) => {
  try {
    const matriculacion = await matriculacionRepository().findOne({
      where: { id: parseInt(req.params.id) },
    });

    if (!matriculacion) {
      return res.status(404).json({ error: 'Matriculación no encontrada' });
    }

    await matriculacionRepository().remove(matriculacion);
    res.json({ message: 'Matriculación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar matriculación' });
  }
});

export default router;

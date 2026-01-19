import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Modulo } from '../entities/Modulo';

const router = Router();
const moduloRepository = () => AppDataSource.getRepository(Modulo);

router.get('/', async (req, res) => {
  try {
    const modulos = await moduloRepository().find({
      relations: ['ciclo'],
      order: { nombre: 'ASC' },
    });
    res.json(modulos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener módulos' });
  }
});

router.get('/ciclo/:id', async (req, res) => {
  try {
    const modulos = await moduloRepository().find({
      where: { ciclo_id: parseInt(req.params.id) },
      relations: ['ciclo'],
      order: { curso: 'ASC', nombre: 'ASC' },
    });
    res.json(modulos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener módulos del ciclo' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const modulo = await moduloRepository().findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['ciclo'],
    });

    if (!modulo) {
      return res.status(404).json({ error: 'Módulo no encontrado' });
    }

    res.json(modulo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener módulo' });
  }
});

export default router;

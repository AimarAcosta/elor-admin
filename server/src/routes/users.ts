import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Tipo } from '../entities/Tipo';

const router = Router();
const userRepository = () => AppDataSource.getRepository(User);
const tipoRepository = () => AppDataSource.getRepository(Tipo);

// GET /api/users/tipos/all - Obtener tipos de usuario (DEBE IR PRIMERO)
router.get('/tipos/all', async (req, res) => {
  try {
    const tipos = await tipoRepository().find({ order: { id: 'ASC' } });
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tipos' });
  }
});

// GET /api/users/count/students - Contar estudiantes (tipo_id = 4)
router.get('/count/students', async (req, res) => {
  try {
    const count = await userRepository().count({ where: { tipo_id: 4 } });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Error al contar estudiantes' });
  }
});

// GET /api/users/count/teachers - Contar profesores (tipo_id = 3)
router.get('/count/teachers', async (req, res) => {
  try {
    const count = await userRepository().count({ where: { tipo_id: 3 } });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Error al contar profesores' });
  }
});

// GET /api/users/count/all - Contar todos por tipo
router.get('/count/all', async (req, res) => {
  try {
    const students = await userRepository().count({ where: { tipo_id: 4 } });
    const teachers = await userRepository().count({ where: { tipo_id: 3 } });
    const admins = await userRepository().count({ where: { tipo_id: 2 } });
    const total = await userRepository().count();
    res.json({ students, teachers, admins, total });
  } catch (error) {
    res.status(500).json({ error: 'Error al contar usuarios' });
  }
});

// GET /api/users - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await userRepository().find({
      relations: ['tipo'],
      order: { id: 'ASC' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// GET /api/users/role/:tipoId - Obtener usuarios por tipo
router.get('/role/:tipoId', async (req, res) => {
  try {
    const users = await userRepository().find({
      where: { tipo_id: parseInt(req.params.tipoId) },
      relations: ['tipo'],
      order: { nombre: 'ASC' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios por tipo' });
  }
});

// GET /api/users/search/:query - Buscar usuarios
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    const users = await userRepository()
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.tipo', 'tipo')
      .where('LOWER(user.nombre) LIKE :query', { query: `%${query}%` })
      .orWhere('LOWER(user.apellidos) LIKE :query', { query: `%${query}%` })
      .orWhere('LOWER(user.username) LIKE :query', { query: `%${query}%` })
      .orWhere('LOWER(user.email) LIKE :query', { query: `%${query}%` })
      .getMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar usuarios' });
  }
});

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await userRepository().findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['tipo'],
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// POST /api/users/login - Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userRepository().findOne({
      where: { username },
      relations: ['tipo'],
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Comparar contraseña (sin hash por ahora, como en la BD original)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // No enviar la contraseña en la respuesta
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Error en el login' });
  }
});

// POST /api/users - Crear usuario
router.post('/', async (req, res) => {
  try {
    const { email, username, password, nombre, apellidos, dni, direccion, telefono1, telefono2, tipo_id } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await userRepository().findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({ error: 'El usuario o email ya existe' });
    }

    const newUser = userRepository().create({
      email,
      username,
      password,
      nombre,
      apellidos,
      dni,
      direccion,
      telefono1,
      telefono2,
      tipo_id: tipo_id || 4,
    });

    await userRepository().save(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const user = await userRepository().findOne({
      where: { id: parseInt(req.params.id) },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { email, nombre, apellidos, dni, direccion, telefono1, telefono2, tipo_id, password } = req.body;

    if (email) user.email = email;
    if (nombre) user.nombre = nombre;
    if (apellidos) user.apellidos = apellidos;
    if (dni) user.dni = dni;
    if (direccion) user.direccion = direccion;
    if (telefono1) user.telefono1 = telefono1;
    if (telefono2) user.telefono2 = telefono2;
    if (tipo_id) user.tipo_id = tipo_id;
    if (password) user.password = password;

    await userRepository().save(user);

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// DELETE /api/users/:id - Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const user = await userRepository().findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['tipo'],
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // No permitir eliminar god (tipo_id = 1)
    if (user.tipo_id === 1) {
      return res.status(403).json({ error: 'No se puede eliminar al usuario God' });
    }

    await userRepository().remove(user);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

export default router;

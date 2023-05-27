import { Router } from 'express';
import FileManager from '../manager/fileManager.js';
import { Server } from 'socket.io';

const fileManager = new FileManager('products.json');
const router = Router();

router.get('/', async (req, res) => {
  const products = await fileManager.get();
  res.json({ products });
});

router.post('/', async (req, res) => {
  const product = req.body;
  const productAdded = await fileManager.add(product);

  const io = req.app.get('socketio');
  io.emit('newProduct');

  res.json({ status: 'success', productAdded });
});

router.put('/:pid', async (req, res) => {
  const id = parseInt(req.params.pid);
  const productToUpdate = req.body;

  const product = await fileManager.getById(id);
  if (!product) {
    return res.status(404).send('Producto no encontrado');
  }

  for (const key of Object.keys(productToUpdate)) {
    product[key] = productToUpdate[key];
  }

  await fileManager.update(id, product);

  res.json({ status: 'success', product });
});

router.delete('/:pid', async (req, res) => {
  const id = parseInt(req.params.pid);
  const deletedProduct = await fileManager.delete(id);

  const io = req.app.get('socketio');
  io.emit('deleteProduct');

  res.json({ status: 'success', deletedProduct });
});

export default router;
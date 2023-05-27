import { Router } from 'express';
import CartManager from '../manager/cartManager.js';
import { Server } from 'socket.io';

const cartManager = new CartManager('carts.json');
const router = Router();

router.get('/', async (req, res) => {
  const carts = await cartManager.get();
  res.json({ carts });
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const cart = await cartManager.getById(id);
  res.json({ cart });
});

router.post('/', async (req, res) => {
  const newCart = await cartManager.create();

  const io = req.app.get('socketio');
  io.emit('newCart');

  res.json({ status: 'success', newCart });
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);

  const cart = await cartManager.addProduct(cartId, productId);

  const io = req.app.get('socketio');
  io.emit('updateCart');

  res.json({ status: 'success', cart });
});

router.delete('/:cid', async (req, res) => {
  const id = parseInt(req.params.cid);
  const deletedCart = await cartManager.delete(id);

  const io = req.app.get('socketio');
  io.emit('deleteCart');

  res.json({ status: 'success', deletedCart });
});

export default router;
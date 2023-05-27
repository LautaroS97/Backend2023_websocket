import fs from 'fs';
import { Server } from 'socket.io';

class CartManager {
  constructor(path, io) {
    this.path = path;
    this.io = io;
  }

  read = () => {
    if (fs.existsSync(this.path)) {
      return fs.promises.readFile(this.path, 'utf-8').then((r) => JSON.parse(r));
    }
    return [];
  };

  getNextId = (list) => {
    const count = list.length;
    return count > 0 ? list[count - 1].id + 1 : 1;
  };

  write = (list) => {
    return fs.promises.writeFile(this.path, JSON.stringify(list, null, 2));
  };

  get = async () => {
    const data = await this.read();
    return data;
  };

  create = async () => {
    const carts = await this.read();
    const nextId = this.getNextId(carts);

    const newCart = {
      id: nextId,
      products: [],
    };
    carts.push(newCart);

    await this.write(carts);

    return newCart;
  };

  update = async (id, obj) => {
    obj.id = id;
    const list = await this.read();

    const updatedList = list.map((item) => {
      if (item.id === id) {
        return obj;
      }
      return item;
    });

    await this.write(updatedList);
  };

  addProduct = async (cartId, productId) => {
    const cart = await this.getById(cartId);

    let found = false;
    for (let i = 0; i < cart.products.length; i++) {
      if (cart.products[i].id === productId) {
        cart.products[i].quantity++;
        found = true;
        break;
      }
    }

    if (!found) {
      cart.products.push({
        id: productId,
        quantity: 1,
      });
    }

    await this.update(cartId, cart);

    return cart;
  };

  getById = async (id) => {
    const data = await this.read();
    return data.find((p) => p.id === id);
  };

  delete = async (id) => {
    const list = await this.read();

    const updatedList = list.filter((item) => item.id !== id);

    await this.write(updatedList);
  };
}

export default CartManager;
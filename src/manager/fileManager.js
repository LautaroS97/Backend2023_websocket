import fs from 'fs';
import Product from '../models/product.js';

class FileManager {
  constructor(path) {
    this.path = path;
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

  add = async (obj) => {
    const list = await this.read();
    const nextId = this.getNextId(list);
    obj.id = nextId;

    const product = new Product(
      obj.id,
      obj.title,
      obj.description,
      obj.code,
      obj.price,
      obj.status,
      obj.stock,
      obj.category,
      obj.thumbnails
    );

    list.push(product);

    await this.write(list);

    return product;
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

export default FileManager;
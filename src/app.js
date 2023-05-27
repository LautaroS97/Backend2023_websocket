import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import exphbs from 'express-handlebars';
import path from 'path';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(process.cwd(), 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static(path.join(process.cwd(), 'public')));
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.get('/', (req, res) => res.render('home'));
app.get('/realtimeproducts', (req, res) => res.render('realTimeProducts'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('newProduct', () => {
    io.emit('updateProducts');
  });

  socket.on('deleteProduct', () => {
    io.emit('updateProducts');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const port = 8080;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
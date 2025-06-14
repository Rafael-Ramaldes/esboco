const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const jsonfile = require('jsonfile');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'seu_segredo_aqui',
    resave: false,
    saveUninitialized: true
}));

// Rotas
const authRoutes = require('./routes/authRoutes');
const filmesRoutes = require('./routes/filmesRoutes');
const favoritosRoutes = require('./routes/favoritosRoutes');

app.use('/', authRoutes);
app.use('/filmes', filmesRoutes);
app.use('/favoritos', favoritosRoutes);

// Banco de dados simulado
global.db = {
    filmes: jsonfile.readFileSync('./database.json').filmes || [],
    usuarios: jsonfile.readFileSync('./database.json').usuarios || []
};

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
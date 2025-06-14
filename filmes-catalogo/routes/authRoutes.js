const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Página de login
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Processar login
router.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const usuario = global.db.usuarios.find(u => u.email === email);
    
    if (usuario && bcrypt.compareSync(senha, usuario.senha)) {
        req.session.usuario = usuario;
        res.redirect('/filmes');
    } else {
        res.render('login', { error: 'Email ou senha incorretos' });
    }
});

// Página de registro
router.get('/registro', (req, res) => {
    res.render('registro', { error: null });
});

// Processar registro
router.post('/registro', (req, res) => {
    const { email, senha } = req.body;
    
    if (global.db.usuarios.some(u => u.email === email)) {
        return res.render('registro', { error: 'Email já cadastrado' });
    }
    
    const novoUsuario = {
        id: global.db.usuarios.length + 1,
        email,
        senha: bcrypt.hashSync(senha, 10)
    };
    
    global.db.usuarios.push(novoUsuario);
    require('jsonfile').writeFileSync('./database.json', global.db);
    
    req.session.usuario = novoUsuario;
    res.redirect('/filmes');
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;
const express = require('express');
const router = express.Router();

// Middleware para verificar autenticação
function requireAuth(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
    next();
}

// Catálogo de filmes
router.get('/', requireAuth, (req, res) => {
    const filmes = global.db.filmes;
    const filmesDestaque = filmes.filter(f => f.destaque);
    const generos = [...new Set(filmes.map(f => f.genero))];
    
    res.render('catalogo', { 
        usuario: req.session.usuario,
        filmesDestaque,
        generos,
        filmes 
    });
});

// Detalhes do filme
router.get('/:id', requireAuth, (req, res) => {
    const filme = global.db.filmes.find(f => f.id == req.params.id);
    
    if (!filme) {
        return res.status(404).send('Filme não encontrado');
    }
    
    res.render('detalhes', { 
        usuario: req.session.usuario,
        filme 
    });
});

module.exports = router;
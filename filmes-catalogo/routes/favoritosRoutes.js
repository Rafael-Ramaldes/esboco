const express = require('express');
const router = express.Router();
const jsonfile = require('jsonfile');

function requireAuth(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
    next();
}

// Adicionar favorito
router.post('/adicionar', requireAuth, (req, res) => {
    const filmeId = parseInt(req.body.filmeId);
    const usuarioId = req.session.usuario.id;
    
    // Encontrar o usuário no banco de dados
    const usuarioIndex = global.db.usuarios.findIndex(u => u.id === usuarioId);
    if (usuarioIndex === -1) return res.status(404).json({ success: false });
    
    // Inicializar array de favoritos se não existir
    if (!global.db.usuarios[usuarioIndex].favoritos) {
        global.db.usuarios[usuarioIndex].favoritos = [];
    }
    
    // Adicionar filme aos favoritos se ainda não estiver
    if (!global.db.usuarios[usuarioIndex].favoritos.includes(filmeId)) {
        global.db.usuarios[usuarioIndex].favoritos.push(filmeId);
    }
    
    // Atualizar sessão e banco de dados
    req.session.usuario = global.db.usuarios[usuarioIndex];
    jsonfile.writeFileSync('./database.json', global.db);
    
    res.json({ success: true });
});

// Remover favorito
router.post('/remover', requireAuth, (req, res) => {
    const filmeId = parseInt(req.body.filmeId);
    const usuarioId = req.session.usuario.id;
    
    // Encontrar o usuário no banco de dados
    const usuarioIndex = global.db.usuarios.findIndex(u => u.id === usuarioId);
    if (usuarioIndex === -1) return res.status(404).json({ success: false });
    
    // Remover filme dos favoritos
    if (global.db.usuarios[usuarioIndex].favoritos) {
        global.db.usuarios[usuarioIndex].favoritos = 
            global.db.usuarios[usuarioIndex].favoritos.filter(id => id !== filmeId);
    }
    
    // Atualizar sessão e banco de dados
    req.session.usuario = global.db.usuarios[usuarioIndex];
    jsonfile.writeFileSync('./database.json', global.db);
    
    res.json({ success: true });
});

// Lista de favoritos
router.get('/', requireAuth, (req, res) => {
    const favoritosIds = req.session.usuario.favoritos || [];
    const favoritos = global.db.filmes.filter(f => favoritosIds.includes(f.id));
    
    res.render('favoritos', { 
        usuario: req.session.usuario,
        favoritos 
    });
});

module.exports = router;
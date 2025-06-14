document.addEventListener('DOMContentLoaded', function() {
    // Função para tratar clique nos favoritos
    function handleFavoritoClick(event) {
        const btn = event.target.closest('.favorito-btn');
        if (!btn) return;

        event.preventDefault();
        
        const filmeId = btn.dataset.filmeId;
        const isFavorito = btn.classList.contains('btn-warning');
        const action = isFavorito ? 'remover' : 'adicionar';
        
        fetch(`/favoritos/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filmeId: parseInt(filmeId) })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Atualizar UI
                btn.classList.toggle('btn-warning');
                btn.classList.toggle('btn-outline-warning');
                
                // Atualizar ícone
                const icon = btn.querySelector('i') || btn;
                if (icon.textContent.includes('★') || icon.textContent.includes('☆')) {
                    icon.textContent = icon.textContent.includes('★') ? '☆' : '★';
                }
                
                // Atualizar texto se existir
                const textSpan = btn.querySelector('.favorito-text');
                if (textSpan) {
                    textSpan.textContent = isFavorito ? ' Adicionar' : ' Remover';
                }
                
                // Se estiver na página de favoritos, remover o card
                if (isFavorito && window.location.pathname === '/favoritos') {
                    btn.closest('.filme-card')?.remove();
                    
                    // Mostrar mensagem se não houver favoritos
                    if (!document.querySelector('.filme-card')) {
                        const noFavs = document.createElement('div');
                        noFavs.className = 'alert alert-info mt-4';
                        noFavs.textContent = 'Nenhum filme favorito encontrado.';
                        document.querySelector('.favoritos-container')?.appendChild(noFavs);
                    }
                }
            } else {
                throw new Error(data.message || 'Erro desconhecido');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert(error.message || 'Ocorreu um erro ao atualizar os favoritos');
        });
    }

    // Adicionar event listener
    document.addEventListener('click', handleFavoritoClick);
});
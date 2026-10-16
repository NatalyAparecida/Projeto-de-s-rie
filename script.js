let listaSeries = [];

// Elementos da Interface
const btnCarregar = document.getElementById('btn-carregar');
const searchInput = document.getElementById('search-input');
const filterGenero = document.getElementById('filter-genero');
const filterAno = document.getElementById('filter-ano');
const btnOrdenar = document.getElementById('btn-ordenar');
const catalog = document.getElementById('catalog');
const statsSection = document.getElementById('estatisticas');

// Eventos
btnCarregar.addEventListener('click', carregarSeries);
searchInput.addEventListener('input', aplicarFiltros);
filterGenero.addEventListener('change', aplicarFiltros);
filterAno.addEventListener('change', aplicarFiltros);
btnOrdenar.addEventListener('click', ordenarPorAno);

// Funcionalidade 3: Carregar dados via Fetch
function carregarSeries() {
    fetch('series.json')
        .then(response => response.json())
        .then(data => {
            listaSeries = data.series;
            
            // Habilitar os inputs da interface
            searchInput.disabled = false;
            filterGenero.disabled = false;
            filterAno.disabled = false;
            btnOrdenar.disabled = false;
            
            // Renderizar e calcular estatísticas iniciais
            renderizarCards(listaSeries);
            calcularEstatisticas(listaSeries);
            
            // Desabilita o botão carregar após o uso
            btnCarregar.disabled = true;
            btnCarregar.innerText = "Séries Carregadas";
        })
        .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));
}

// Renderizar os cards na tela
function renderizarCards(series) {
    catalog.innerHTML = '';
    
    if (series.length === 0) {
        catalog.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">Nenhuma série encontrada.</p>';
        return;
    }

    series.forEach(serie => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${serie.imagem}" alt="${serie.titulo}">
            <h3>${serie.titulo}</h3>
            <p><strong>Ano:</strong> ${serie.ano}</p>
            <p><strong>Gênero:</strong> ${serie.genero}</p>
            <p><strong>Temporadas:</strong> ${serie.temporadas}</p>
        `;
        catalog.appendChild(card);
    });
}

// Funcionalidade 4: Filtros de Pesquisa (Título, Gênero e Ano)
function aplicarFiltros() {
    const termoBusca = searchInput.value.toLowerCase();
    const generoSelecionado = filterGenero.value;
    const anoSelecionado = filterAno.value;

    const seriesFiltradas = listaSeries.filter(serie => {
        const bateTitulo = serie.titulo.toLowerCase().includes(termoBusca);
        const bateGenero = generoSelecionado === "" || serie.genero === generoSelecionado;
        const bateAno = anoSelecionado === "" || serie.ano.toString() === anoSelecionado;
        
        return bateTitulo && bateGenero && bateAno;
    });

    renderizarCards(seriesFiltradas);
}

// Funcionalidade 4: Ordenar por Ano (Mais antiga para mais recente)
function ordenarPorAno() {
    listaSeries.sort((a, b) => a.ano - b.ano);
    aplicarFiltros(); // Re-renderiza respeitando qualquer filtro ativo
}

// Funcionalidade 5: Estatísticas
function calcularEstatisticas(series) {
    if (series.length === 0) return;

    statsSection.classList.remove('hidden');
    
    // Total de séries
    document.getElementById('stat-total').innerText = series.length;

    // Achar a mais antiga e a mais recente
    let maisAntiga = series[0];
    let maisRecente = series[0];

    series.forEach(serie => {
        if (serie.ano < maisAntiga.ano) maisAntiga = serie;
        if (serie.ano > maisRecente.ano) maisRecente = serie;
    });

    document.getElementById('stat-antiga').innerText = `${maisAntiga.titulo} (${maisAntiga.ano})`;
    document.getElementById('stat-recente').innerText = `${maisRecente.titulo} (${maisRecente.ano})`;
}

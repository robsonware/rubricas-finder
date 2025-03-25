/**
 * Classe responsável por gerenciar a interface do usuário
 * Centraliza todas as operações de manipulação do DOM
 */
export class UIManager {
    constructor() {
        this.modal = null;
    }

    /**
     * Cria a estrutura básica da modal
     * @returns {HTMLElement} - Elemento da modal criada
     */
    createModal() {
        const modalHtml = `
            <div class="modal" id="search-modal">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Resultados da Busca</p>
                    </header>
                    <section class="modal-card-body">
                        <div class="search-term"></div>
                        <div class="search-results"></div>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button is-primary close-modal">Fechar</button>
                    </footer>
                </div>
            </div>
        `;

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer.firstElementChild);

        this.modal = document.getElementById('search-modal');
        return this.modal;
    }

    /**
     * Configura os listeners de eventos da modal
     * @param {Function} closeCallback - Função a ser chamada ao fechar a modal
     */
    setupModalEventListeners(closeCallback) {
        if (!this.modal) {
            console.error('Modal não foi inicializada');
            return;
        }
        
        const closeButton = this.modal.querySelector('.close-modal');
        const modalBackground = this.modal.querySelector('.modal-background');

        closeButton.addEventListener('click', closeCallback);
        modalBackground.addEventListener('click', closeCallback);
    }

    /**
     * Exibe a modal
     */
    showModal() {
        if (this.modal) {
            this.modal.classList.add('is-active');
        }
    }

    /**
     * Esconde a modal
     */
    hideModal() {
        if (this.modal) {
            this.modal.classList.remove('is-active');
        }
    }

    /**
     * Exibe os resultados da busca na modal
     * @param {Array} results - Resultados da busca
     * @param {string} searchTerm - Termo buscado
     * @param {Function} detailsCallback - Função para exibir detalhes de uma rubrica
     */
    showSearchResults(results, searchTerm, detailsCallback) {
        if (!this.modal) {
            console.error('Modal não foi inicializada');
            return;
        }
        
        const searchTermElement = this.modal.querySelector('.search-term');
        const resultsElement = this.modal.querySelector('.search-results');

        // Atualiza o título da modal
        this.modal.querySelector('.modal-card-title').textContent = 'Resultados da Busca';

        // Exibe o termo de busca
        const isAllRubricas = searchTerm === 'Todas as rubricas';
        searchTermElement.innerHTML = `
            <p class="has-text-weight-bold mb-4">
                ${isAllRubricas ? 'Exibindo todas as rubricas' : `Termo buscado: "<span class="has-text-info" id="search-term">${searchTerm}</span>"`}
                ${results.length > 0 ? `<span class="tag is-info is-light ml-2">${results.length} resultados</span>` : ''}
            </p>
        `;

        // Adiciona evento de clique para realizar nova busca (apenas se não for "Todas as rubricas")
        if (!isAllRubricas) {
            const searchTermClickable = searchTermElement.querySelector('#search-term');
            if (searchTermClickable) {
                searchTermClickable.addEventListener('click', () => detailsCallback(searchTerm));
            }
        }

        // Exibe os resultados ou mensagem de nenhum resultado
        if (results.length === 0) {
            resultsElement.innerHTML = '<p class="has-text-centered">Nenhum resultado encontrado.</p>';
        } else {
            // Se for uma lista grande, adiciona uma mensagem informativa
            let infoMessage = '';
            if (results.length > 50) {
                infoMessage = `
                    <div class="notification is-info is-light mb-4">
                        <p>Mostrando ${results.length} rubricas. Use a busca para filtrar resultados específicos.</p>
                    </div>
                `;
            }
            
            // Limita a quantidade de resultados exibidos para evitar sobrecarga do navegador
            const displayResults = results.length > 100 ? results.slice(0, 100) : results;
            
            resultsElement.innerHTML = `
                ${infoMessage}
                ${displayResults.map(result => `
                    <div class="box box-resultadoBusca mb-3 result-item" data-codigo="${result.codigo}">
                        <h3 class="title is-4 mb-5">${result.nome}</h3>
                        <p class="subtitle is-6">Código: <span class="has-text-weight-bold has-text-success">${result.codigo}</span></p>
                        <p>${result.descricao}</p>
                    </div>
                `).join('')}
                ${results.length > 100 ? `
                    <div class="notification is-warning is-light mt-4">
                        <p>Exibindo apenas os primeiros 100 resultados de ${results.length}. Use a busca para refinar sua consulta.</p>
                    </div>
                ` : ''}
            `;

            // Adiciona eventos de clique para cada resultado
            const resultItems = resultsElement.querySelectorAll('.result-item');
            resultItems.forEach(item => {
                item.addEventListener('click', () => {
                    const codigo = item.getAttribute('data-codigo');
                    detailsCallback(codigo, searchTerm);
                });
            });
        }

        this.showModal();
    }

    /**
     * Exibe os detalhes de uma rubrica na modal
     * @param {Object} rubrica - Objeto com os detalhes da rubrica
     * @param {string} searchTerm - Termo de busca original para voltar
     * @param {Function} backCallback - Função para voltar aos resultados
     */
    showRubricaDetails(rubrica, searchTerm, backCallback) {
        if (!this.modal) {
            console.error('Modal não foi inicializada');
            return;
        }
        
        const searchTermElement = this.modal.querySelector('.search-term');
        const resultsElement = this.modal.querySelector('.search-results');

        // Atualiza o título da modal
        this.modal.querySelector('.modal-card-title').textContent = 'Detalhes da Rubrica';

        // Adiciona botão de voltar
        searchTermElement.innerHTML = `
            <p class="has-text-weight-bold mb-4">
                <button class="button is-small is-info mr-2" id="back-to-results">
                    <span class="icon">
                        <i class="fas fa-arrow-left"></i>
                    </span>
                    <span>Voltar para resultados</span>
                </button>
            </p>
        `;

        // Adiciona evento ao botão de voltar
        const backButton = searchTermElement.querySelector('#back-to-results');
        backButton.addEventListener('click', () => backCallback(searchTerm));

        // Formata informações adicionais se disponíveis
        let infoAdicional = '';
        if (rubrica.tipo) {
            infoAdicional += `<p><strong>Tipo:</strong> ${rubrica.tipo}</p>`;
        }
        
        // Informações sobre incidências e classificações
        const infoINSS = [];
        if (rubrica.inss_incidencia) infoINSS.push(`<p><strong>Incidência:</strong> ${rubrica.inss_incidencia}</p>`);
        if (rubrica.inss_classificacao) infoINSS.push(`<p><strong>Classificação:</strong> ${rubrica.inss_classificacao}</p>`);
        if (rubrica.inss_baselegal) infoINSS.push(`<p><strong>Base legal:</strong> ${rubrica.inss_baselegal}</p>`);
        
        const infoIR = [];
        if (rubrica.ir_incidencia) infoIR.push(`<p><strong>Incidência:</strong> ${rubrica.ir_incidencia}</p>`);
        if (rubrica.ir_classificacao) infoIR.push(`<p><strong>Classificação:</strong> ${rubrica.ir_classificacao}</p>`);
        if (rubrica.ir_baselegal) infoIR.push(`<p><strong>Base legal:</strong> ${rubrica.ir_baselegal}</p>`);
        
        const infoFGTS = [];
        if (rubrica.fgts_incidencia) infoFGTS.push(`<p><strong>Incidência:</strong> ${rubrica.fgts_incidencia}</p>`);
        if (rubrica.fgts_classificacao) infoFGTS.push(`<p><strong>Classificação:</strong> ${rubrica.fgts_classificacao}</p>`);
        if (rubrica.fgts_baselegal) infoFGTS.push(`<p><strong>Base legal:</strong> ${rubrica.fgts_baselegal}</p>`);
        
        const infoCS = [];
        if (rubrica.cs_incidencia) infoCS.push(`<p><strong>Incidência:</strong> ${rubrica.cs_incidencia}</p>`);
        if (rubrica.cs_classificacao) infoCS.push(`<p><strong>Classificação:</strong> ${rubrica.cs_classificacao}</p>`);
        if (rubrica.cs_baselegal) infoCS.push(`<p><strong>Base legal:</strong> ${rubrica.cs_baselegal}</p>`);
        
        // Prepara o card de repercussões
        const repercussoes = [];
        
        // Verifica cada propriedade de repercussão e adiciona à lista se for true
        if (rubrica.dsr === true) repercussoes.push('<span class="tag is-success mr-2 mb-2" title="Descanso semanal remunerado">DSR</span>');
        if (rubrica.ferias === true) repercussoes.push('<span class="tag is-success mr-2 mb-2">Férias</span>');
        if (rubrica.aviso_previo === true) repercussoes.push('<span class="tag is-success mr-2 mb-2">Aviso Prévio</span>');
        if (rubrica.decimo_terceiro_salario === true) repercussoes.push('<span class="tag is-success mr-2 mb-2">13º Salário</span>');
        if (rubrica.afastamento === true) repercussoes.push('<span class="tag is-success mr-2 mb-2">Afastamento</span>');
        
        // Verifica se há repercussões negativas (false) para exibir em vermelho
        if (rubrica.dsr === false) repercussoes.push('<span class="tag is-danger mr-2 mb-2">DSR</span>');
        if (rubrica.ferias === false) repercussoes.push('<span class="tag is-danger mr-2 mb-2">Férias</span>');
        if (rubrica.aviso_previo === false) repercussoes.push('<span class="tag is-danger mr-2 mb-2">Aviso Prévio</span>');
        if (rubrica.decimo_terceiro_salario === false) repercussoes.push('<span class="tag is-danger mr-2 mb-2">13º Salário</span>');
        if (rubrica.afastamento === false) repercussoes.push('<span class="tag is-danger mr-2 mb-2">Afastamento</span>');
        
        // Cria o HTML do card de repercussões
        const repercussoesHtml = repercussoes.length > 0 ? 
            `<div class="box p-3 mb-3">
                <h5 class="title is-6">Repercute em:</h5>
                <div class="tags">
                    ${repercussoes.join('')}
                </div>
                <p class="is-size-7 mt-2">
                    <span class="tag is-success is-light mr-1">Verde</span>: Incide
                    <span class="tag is-danger is-light ml-2 mr-1">Vermelho</span>: Não incide
                </p>
            </div>` : '';

        // Exibe os detalhes da rubrica
        resultsElement.innerHTML = `
            <h3 class="title is-4 mb-5">${rubrica.nome || 'Nome não disponível'}</h3>
            <p class="subtitle is-6">Código: <span class="has-text-weight-bold has-text-success">${rubrica.codigo || 'Código não disponível'}</span></p>
            <div class="content">
                <p>${rubrica.descricao || 'Descrição não disponível'}</p>
                ${infoAdicional}
                
                <div class="mt-4">
                    <h4 class="title is-5">Tributação e Encargos</h4>
                    
                    ${infoINSS.length > 0 ? 
                        `<div class="box p-3 mb-3">
                            <h5 class="title is-6">INSS</h5>
                            ${infoINSS.join('')}
                        </div>` : ''}
                    
                    ${infoIR.length > 0 ? 
                        `<div class="box p-3 mb-3">
                            <h5 class="title is-6">Imposto de Renda</h5>
                            ${infoIR.join('')}
                        </div>` : ''}
                    
                    ${infoFGTS.length > 0 ? 
                        `<div class="box p-3 mb-3">
                            <h5 class="title is-6">FGTS</h5>
                            ${infoFGTS.join('')}
                        </div>` : ''}
                    
                    ${infoCS.length > 0 ? 
                        `<div class="box p-3 mb-3">
                            <h5 class="title is-6">Contribuição Sindical</h5>
                            ${infoCS.join('')}
                        </div>` : ''}
                </div>

                ${repercussoesHtml}
            </div>
        `;

        this.showModal();
    }
}

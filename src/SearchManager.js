import { SearchService } from './SearchService.js';

export class SearchManager {
    /**
     * @param {SearchService} searchService - Serviço de busca
     * @param {Object} modalManager - Gerenciador de modal
     */
    constructor(searchService, modalManager) {
        this.searchService = searchService;
        this.modalManager = modalManager;
        this.searchInput = document.getElementById('search-input');
        this.searchButton = document.getElementById('search-button');
        
        // Não chama mais init() no construtor, será chamado explicitamente
    }

    /**
     * Inicializa o gerenciador de busca
     */
    init() {
        if (this.searchInput && this.searchButton) {
            this.setupEventListeners();
        } else {
            console.error('Elementos de busca não encontrados no DOM');
        }
    }

    /**
     * Configura os listeners de eventos
     */
    setupEventListeners() {
        this.searchButton.addEventListener('click', () => {
            this.handleSearch(this.searchInput.value);
        });
        
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch(this.searchInput.value);
            }
        });
    }

    /**
     * Manipula a busca por rubricas
     * @param {string} searchTerm - Termo de busca
     */
    async handleSearch(searchTerm) {
        try {
            // Normaliza o termo de busca
            const term = searchTerm ? searchTerm.trim() : '';
            console.log(`Realizando busca por: "${term}"`);
            
            // Busca mesmo que o termo esteja vazio
            const results = await this.searchService.search(term);
            
            // Define o título da busca
            const displayTerm = term || 'Todas as rubricas';
            
            // Exibe os resultados na modal
            this.modalManager.showSearchResults(results, displayTerm);
        } catch (error) {
            console.error('Erro ao realizar busca:', error);
        }
    }
}
import { RequestService } from './RequestService.js';
import { SearchService } from './SearchService.js';
import { UIManager } from './UIManager.js';

export class ModalManager {
    /**
     * @param {Object} uiManager - Gerenciador de UI
     * @param {Object} requestService - Serviço de requisição
     */
    constructor(uiManager, requestService) {
        this.uiManager = uiManager;
        this.requestService = requestService;
        this.searchService = null;
        
        // Armazena os resultados da última busca e o termo usado
        this.lastSearchResults = [];
        this.lastSearchTerm = '';
    }

    /**
     * Define o serviço de busca
     * @param {Object} searchService - Serviço de busca
     */
    setSearchService(searchService) {
        this.searchService = searchService;
    }

    /**
     * Exibe os resultados da busca na modal
     * @param {Array} results - Resultados da busca
     * @param {string} searchTerm - Termo de busca
     */
    showSearchResults(results, searchTerm) {
        // Armazena os resultados e o termo para poder voltar a eles depois
        this.lastSearchResults = results;
        this.lastSearchTerm = searchTerm;
        
        // Exibe os resultados usando o UIManager
        this.uiManager.showSearchResults(results, searchTerm, (codigo) => this.handleRubricaClick(codigo, searchTerm));
    }

    /**
     * Manipula o clique em uma rubrica
     * @param {string} codigo - Código da rubrica
     * @param {string} searchTerm - Termo de busca
     */
    async handleRubricaClick(codigo, searchTerm) {
        let rubrica;

        try {
            console.log(`Buscando rubrica com código: ${codigo}`);
            rubrica = await this.requestService.getRubrica(codigo);
            console.log(`Resposta obtida:`, rubrica);
        } catch (error) {
            console.error('Erro ao buscar detalhes da rubrica:', error);
            return;
        }

        // Verificar se a rubrica tem os dados necessários
        if (!rubrica || !rubrica.nome || !rubrica.codigo || !rubrica.descricao) {
            console.error('Dados da rubrica incompletos ou inválidos:', rubrica);
            
            // Criar um objeto com dados padrão para evitar undefined na tela
            rubrica = {
                nome: rubrica?.nome || 'Nome não disponível',
                codigo: rubrica?.codigo || codigo || 'Código não disponível',
                descricao: rubrica?.descricao || 'Descrição não disponível'
            };
        }

        // Garantir que o termo de busca seja válido para o botão de voltar
        const validSearchTerm = searchTerm || 'Todas as rubricas';

        // Exibe os detalhes da rubrica na modal
        this.uiManager.showRubricaDetails(rubrica, validSearchTerm, () => this.backToResults());
    }
    
    /**
     * Volta para os resultados da última busca
     */
    backToResults() {
        console.log(`Voltando para os resultados da busca: "${this.lastSearchTerm}" (${this.lastSearchResults.length} resultados)`);
        
        // Verifica se temos resultados armazenados
        if (this.lastSearchResults.length > 0) {
            this.showSearchResults(this.lastSearchResults, this.lastSearchTerm);
        } else {
            // Se não temos resultados armazenados, faz uma nova busca
            this.performSearch(this.lastSearchTerm);
        }
    }

    /**
     * Realiza uma busca
     * @param {string} searchTerm - Termo de busca
     */
    async performSearch(searchTerm) {
        if (!this.searchService) {
            console.error('SearchService não foi definido');
            return;
        }

        try {
            console.log(`Realizando busca por termo: "${searchTerm}"`);
            
            // Verifica se é o termo especial "Todas as rubricas"
            let results;
            if (searchTerm === 'Todas as rubricas') {
                console.log('Buscando todas as rubricas...');
                results = await this.searchService.getAllRubricas();
            } else {
                results = await this.searchService.search(searchTerm);
            }
            
            console.log(`Busca retornou ${results.length} resultados`);
            this.showSearchResults(results, searchTerm);
        } catch (error) {
            console.error('Erro ao realizar busca:', error);
        }
    }
}
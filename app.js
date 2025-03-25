import { ThemeManager } from './src/ThemeManager.js';
import { SearchManager } from './src/SearchManager.js';
import { ModalManager } from './src/ModalManager.js';
import { UIManager } from './src/UIManager.js';
import { RequestService } from './src/RequestService.js';
import { SearchService } from './src/SearchService.js';

// Inicializa os gerenciadores quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Inicializando aplicação...');
    
    // Inicializa o gerenciador de tema
    new ThemeManager();
    
    // Inicializa o gerenciador de UI
    const uiManager = new UIManager();
    
    // Cria a modal e configura os eventos
    const modal = uiManager.createModal();
    if (modal) {
        uiManager.setupModalEventListeners(() => {
            uiManager.hideModal();
        });
        console.log('Modal inicializada com sucesso');
    } else {
        console.error('Falha ao criar a modal');
    }
    
    // Inicializa o serviço de requisição (sem URL da API)
    const requestService = new RequestService();
    
    // Inicializa o serviço de busca e pré-carrega as rubricas
    const searchService = new SearchService();
    try {
        console.log('Pré-carregando lista de rubricas...');
        await searchService.loadRubricas();
        console.log('Lista de rubricas carregada com sucesso');
    } catch (error) {
        console.error('Erro ao pré-carregar rubricas:', error);
    }
    
    // Inicializa o gerenciador de modal com os serviços necessários
    const modalManager = new ModalManager(uiManager, requestService);
    modalManager.setSearchService(searchService);
    
    // Inicializa o gerenciador de busca
    const searchManager = new SearchManager(searchService, modalManager);
    
    // Inicializa explicitamente o SearchManager (isso configura os eventos de busca)
    searchManager.init();
    
    // Expõe o modalManager globalmente para debugging
    window.modalManager = modalManager;
    
    console.log('Aplicação inicializada com sucesso');
});
export class RequestService {
    constructor() {
        // Inicializa o caminho base do projeto
        this.basePath = this.getBasePath();
    }

    /**
     * Obtém o caminho base do projeto, considerando se está hospedado no GitHub Pages
     * @returns {string} Caminho base do projeto
     */
    getBasePath() {
        // Verifica se está rodando no GitHub Pages
        const isGitHubPages = window.location.hostname.includes('github.io');
        if (isGitHubPages) {
            // Extrai o caminho base do repositório a partir da URL
            const pathSegments = window.location.pathname.split('/');
            // Para GitHub Pages, o primeiro segmento após o domínio é o nome do repositório
            if (pathSegments.length > 1) {
                return `/${pathSegments[1]}`;
            }
        }
        // Se não estiver no GitHub Pages, usa o caminho raiz
        return '';
    }

    /**
     * Busca a rubrica de um arquivo JSON local
     * @param {string} codigo - Código da rubrica
     * @returns {Promise<Object>} Detalhes da rubrica
     */
    async getRubrica(codigo) {
        if (!codigo) {
            throw new Error('Código da rubrica não fornecido');
        }

        try {
            console.log(`Buscando rubrica do arquivo local: ${codigo}.json`);
            const response = await fetch(`${this.basePath}/data/rubricas/${codigo}.json`);
            
            if (!response.ok) {
                throw new Error(`Arquivo não encontrado para o código ${codigo}`);
            }
            
            const data = await response.json();
            console.log(`Rubrica ${codigo} carregada do arquivo local com sucesso`);
            return data;
        } catch (error) {
            console.error(`Erro ao carregar arquivo local para rubrica ${codigo}:`, error);
            throw error;
        }
    }
}
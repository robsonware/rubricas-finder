export class SearchService {
    constructor() {
        this.rubricas = null;
        this.isLoading = false;
        this.loadPromise = null;
    }

    /**
     * Carrega a lista de rubricas do arquivo JSON
     * @returns {Promise} Promise que resolve quando as rubricas forem carregadas
     */
    async loadRubricas() {
        // Se já estiver carregando, retorna a promise existente
        if (this.isLoading && this.loadPromise) {
            return this.loadPromise;
        }
        
        // Se já estiver carregado, retorna imediatamente
        if (this.rubricas) {
            return Promise.resolve(this.rubricas);
        }
        
        this.isLoading = true;
        
        // Cria uma nova promise para o carregamento
        this.loadPromise = new Promise(async (resolve, reject) => {
            try {
                console.log('Carregando lista de rubricas...');
                const response = await fetch('/data/listagem-rubricas.json');
                
                if (!response.ok) {
                    throw new Error(`Erro ao carregar rubricas: ${response.status} ${response.statusText}`);
                }
                
                this.rubricas = await response.json();
                console.log(`Rubricas carregadas com sucesso: ${this.rubricas.length} itens`);
                resolve(this.rubricas);
            } catch (error) {
                console.error('Erro ao carregar rubricas:', error);
                this.rubricas = [];
                reject(error);
            } finally {
                this.isLoading = false;
            }
        });
        
        return this.loadPromise;
    }

    /**
     * Retorna todas as rubricas disponíveis
     * @returns {Promise<Array>} Promise que resolve com a lista de todas as rubricas
     */
    async getAllRubricas() {
        await this.ensureRubricasLoaded();
        
        if (!this.rubricas || this.rubricas.length === 0) {
            console.warn('Nenhuma rubrica disponível');
            return [];
        }
        
        // Retorna uma cópia da lista de rubricas para evitar modificações acidentais
        return [...this.rubricas];
    }
    
    /**
     * Garante que as rubricas estejam carregadas antes de continuar
     * @returns {Promise} Promise que resolve quando as rubricas estiverem carregadas
     */
    async ensureRubricasLoaded() {
        if (!this.rubricas) {
            await this.loadRubricas();
        }
        return this.rubricas;
    }

    /**
     * Busca rubricas que correspondam ao termo de busca
     * @param {string} term - Termo de busca
     * @returns {Promise<Array>} Promise que resolve com os resultados da busca
     */
    async search(term) {
        await this.ensureRubricasLoaded();
        
        if (!this.rubricas || this.rubricas.length === 0) {
            console.warn('Nenhuma rubrica disponível para busca');
            return [];
        }
        
        // Se o termo estiver vazio, retorna todas as rubricas
        if (!term || term.trim() === '') {
            console.log('Termo de busca vazio, retornando todas as rubricas');
            return this.getAllRubricas(); // Usa o método getAllRubricas para consistência
        }
        
        const searchTerm = term.toLowerCase();
        const results = this.rubricas.filter(rubrica => 
            (rubrica.codigo && rubrica.codigo.toLowerCase().includes(searchTerm)) ||
            (rubrica.nome && rubrica.nome.toLowerCase().includes(searchTerm)) ||
            (rubrica.descricao && rubrica.descricao.toLowerCase().includes(searchTerm))
        );
        
        console.log(`Busca por "${term}" retornou ${results.length} resultados`);
        return results;
    }
}
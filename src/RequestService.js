export class RequestService {
    constructor() {
        // Não precisamos mais da baseUrl
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
            const response = await fetch(`/data/rubricas/${codigo}.json`);
            
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
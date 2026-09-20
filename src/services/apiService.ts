/**
 * Serviço de Dados do Rotas Acessíveis (100% Local e Hard-Coded)
 * 
 * Importa diretamente os dados e respostas pré-mapeadas de `src/data/apiData.ts`
 * e executa cálculos locais (Dijkstra, comparação, saída de emergência e chat),
 * sem qualquer dependência de rede, fetch ou servidor HTTP.
 */

import {
  API_EVENTOS,
  API_COMPARACAO_EXEMPLO,
  API_SAIDAS_EMERGENCIA,
  API_CONVERSA_FAQS,
  API_PAINEL_ORGANIZADOR,
  API_TAREFAS_VALIDACAO,
} from '../data/apiData';
import { POI_LIST, ACCESSIBILITY_PROFILES } from '../data/eventData';
import {
  calculateRoute,
  calculateMultiProfileComparison,
  findClosestEmergencyExit,
} from '../utils/pathfinding';
import type { AccessibilityProfileId, WaypointEdge } from '../data/eventData';
import type { NavigationRoute, ProfileComparisonResult } from '../utils/pathfinding';

export interface ConversaResponse {
  resposta: string;
  intencao?: string;
  faq_id?: number;
  confianca?: number;
  explicacao: {
    metodo: 'VECTOR_SEARCH' | 'REGRAS_LOCAIS';
    apoio_ia_generativa?: boolean;
    distancia_vetorial?: number;
  };
  acao?: {
    tipo: string;
    destino?: string;
    automatica: boolean;
  };
  sugestoes?: string[];
}

export class ApiService {
  /**
   * 1. Listar Eventos (Hard-coded)
   */
  public getEventos() {
    return API_EVENTOS;
  }

  /**
   * 2. Calcular Rota com Dijkstra Ponderado Local
   */
  public calcularRota(
    perfilId: AccessibilityProfileId,
    origemId: string,
    destinoId: string,
    dynamicOverrides?: Map<string, Partial<WaypointEdge>>
  ): NavigationRoute | null {
    const perfil = ACCESSIBILITY_PROFILES[perfilId];
    const fromPoi = POI_LIST.find((p) => p.id === origemId);
    const toPoi = POI_LIST.find((p) => p.id === destinoId);

    if (!fromPoi || !toPoi) return null;

    return calculateRoute(
      fromPoi.position,
      fromPoi.floor,
      toPoi.position,
      toPoi.floor,
      fromPoi,
      toPoi,
      perfil,
      dynamicOverrides
    );
  }

  /**
   * 3. Comparar os 4 Perfis Simultaneamente
   */
  public compararPerfis(
    origemId: string,
    destinoId: string,
    dynamicOverrides?: Map<string, Partial<WaypointEdge>>
  ): ProfileComparisonResult[] {
    const fromPoi = POI_LIST.find((p) => p.id === origemId);
    const toPoi = POI_LIST.find((p) => p.id === destinoId);

    if (!fromPoi || !toPoi) {
      // Retorna o mock estático de comparação de exemplo
      return API_COMPARACAO_EXEMPLO.comparacoes as unknown as ProfileComparisonResult[];
    }

    return calculateMultiProfileComparison(
      fromPoi.position,
      fromPoi.floor,
      toPoi.position,
      toPoi.floor,
      fromPoi,
      toPoi,
      dynamicOverrides
    );
  }

  /**
   * 4. Saída de Emergência Mais Próxima
   */
  public getSaidaEmergencia(
    perfilId: AccessibilityProfileId,
    origemId: string,
    dynamicOverrides?: Map<string, Partial<WaypointEdge>>
  ): NavigationRoute | null {
    const perfil = ACCESSIBILITY_PROFILES[perfilId];
    const fromPoi = POI_LIST.find((p) => p.id === origemId);

    if (!fromPoi) return null;

    return findClosestEmergencyExit(
      fromPoi.position,
      fromPoi.floor,
      perfil,
      dynamicOverrides
    );
  }

  /**
   * 5. Obter Dados de Saídas de Emergência Pré-mapeadas
   */
  public getSaidasPreMapeadas() {
    return API_SAIDAS_EMERGENCIA;
  }

  /**
   * 6. Assistente Conversacional (Base de Conhecimento Hard-coded)
   */
  public enviarConversa(texto: string): ConversaResponse {
    const cleanText = texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // Busca nas FAQs cadastradas
    for (const faq of API_CONVERSA_FAQS) {
      const match = faq.keywords.some((kw) => cleanText.includes(kw));
      if (match) {
        return {
          resposta: faq.resposta,
          intencao: faq.intencao,
          faq_id: faq.id,
          confianca: 0.95,
          explicacao: { metodo: 'REGRAS_LOCAIS' },
          acao: faq.acao,
          sugestoes: faq.sugestoes,
        };
      }
    }

    // Resposta padrão
    return {
      resposta:
        'Olá! Sou a assistente de acessibilidade do evento. Posso te ajudar a encontrar stands, palcos, sanitários acessíveis, salas de acolhimento sensorial e rotas livres de degraus.',
      explicacao: { metodo: 'REGRAS_LOCAIS' },
      sugestoes: [
        'Onde fica a Sala de Acolhimento?',
        'Como chegar ao Stand da Oracle?',
        'Onde fica a saída de emergência?',
      ],
    };
  }

  /**
   * 7. Dados do Painel do Organizador (Hard-coded)
   */
  public getPainel() {
    return API_PAINEL_ORGANIZADOR;
  }

  /**
   * 8. Roteiro de Tarefas de Validação (Hard-coded)
   */
  public getTarefas() {
    return API_TAREFAS_VALIDACAO;
  }
}

export const apiService = new ApiService();

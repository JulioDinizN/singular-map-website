# 📡 Rotas Acessíveis · Especificação Completa e Mapeamento da API REST

> **Oracle REST Data Services (ORDS) · Módulo `rotas.v1`**  
> **Banco de Dados**: Oracle Autonomous AI Database 26ai (`23.26.3.3.0` · OCI São Paulo)  
> **Schema**: `ACESSO_APP`  
> **Base Path**: `/ords/acesso_app/api/v1/`  
> **Arquivo de Dump JSON**: [`api-dump.json`](./api-dump.json)

Este documento mapeia integralmente todos os **18 endpoints** disponibilizados pela API do sistema **Rotas Acessíveis**, incluindo parâmetros, formatos de requisição, esquemas de resposta, regras de negócio e estratégia para **operação offline** (quando a API remota estiver indisponível).

---

## 📑 Sumário de Handlers REST (18 Endpoints)

| # | Método | Endpoint / Caminho | Descrição | Autenticação |
| :-: | :---: | :--- | :--- | :---: |
| 1 | `GET` | `/eventos` | Lista todos os eventos cadastrados | Pública |
| 2 | `GET` | `/eventos/{evento}` | Planta, áreas, perfis, pontos, trechos, programação e reportes | Pública |
| 3 | `GET` | `/eventos/{evento}/rota?perfil=&origem=&destino=` | Cálculo de menor caminho via Dijkstra ponderado | Pública |
| 4 | `GET` | `/eventos/{evento}/comparar?origem=&destino=` | Comparação do mesmo trajeto entre os 4 perfis | Pública |
| 5 | `GET` | `/eventos/{evento}/saida?perfil=&origem=` | Rota de evacuação / saída de emergência viável por perfil | Pública |
| 6 | `POST` | `/eventos/{evento}/conversa` | Assistente conversacional in-database com AI Vector Search | Pública |
| 7 | `POST` | `/eventos/{evento}/assistente` | Classificador semântico e extrator de intenções/entidades NLU | Pública |
| 8 | `POST` | `/eventos/{evento}/reportes` | Crowdsourcing de incidentes (`CHEIO`, `BARULHO`, `BLOQUEIO`, `LIBERADO`) | Pública |
| 9 | `POST` | `/eventos/{evento}/sensores` | Telemetria de contagem de pessoas e ajuste de densidade (1–5) | PIN (`2026`) |
| 10 | `GET` | `/eventos/{evento}/painel` | Indicadores em tempo real para o painel do organizador | Pública |
| 11 | `POST` | `/eventos/{evento}/evacuacao` | Aciona ou encerra modo de emergência/evacuação geral | PIN (`2026`) |
| 12 | `POST` | `/eventos/{evento}/decisoes` | Telemetria de decisão humana (`SEGUIU`, `OUTRA_OPCAO`, `TROCOU_PERFIL`) | Pública |
| 13 | `POST` | `/eventos/{evento}/treino/ensinar` | Curadoria in-database: adiciona frase vetorizada com `VECTOR(384)` | PIN (`2026`) |
| 14 | `GET` | `/rotulos` | Rótulos de intenções e FAQs para curadoria | Pública |
| 15 | `GET` | `/eventos/{evento}/tarefas` | Tarefas do protocolo de teste de usabilidade | Pública |
| 16 | `POST` | `/eventos/{evento}/validacao/participantes` | Cadastro de participante de validação (consentimento LGPD) | Pública |
| 17 | `POST` | `/eventos/{evento}/validacao/execucoes` | Registro de tarefa cronometrada e taxa de sucesso | Pública |
| 18 | `POST` | `/eventos/{evento}/reset` | Restaura ruído e lotação base do cenário de demonstração | PIN (`2026`) |

---

## 🧮 1. Motor de Rotas e Fórmula de Custo (Dijkstra Ponderado)

O cálculo de menor caminho é executado pelo package `AC_ROTAS` (ou pelo espelho local `pathfinding.ts` / `motorLocal.js` em modo offline) seguindo a fórmula ponderada por perfil:

$$\text{custo} = \text{distancia} \times \left(1 + \frac{(\text{ruido} - 1) \times \text{peso\_ruido}}{10} + \frac{(\text{lotacao} - 1) \times \text{peso\_lotacao}}{10} + \max(0, \text{lotacao} - \text{lotacao\_limite}) \times \text{fator\_excesso} + \max(0, \text{ruido} - \text{ruido\_limite}) \times \text{fator\_excesso}\right)$$

### Matriz de Perfis de Acessibilidade

| Perfil | Evita Escada | Peso Ruído | Peso Lotação | Limite Lotação | Limite Ruído | Fator Excesso | Velocidade |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **PADRAO** | Não | 1 | 1 | — | — | 2 | 72 m/min |
| **CADEIRANTE** | **Sim** | 1 | 4 | 3 | — | 4 | 55 m/min |
| **MOBILIDADE** | **Sim** | 1 | 3 | 3 | — | 3 | 50 m/min |
| **NEURODIVERGENTE** | Não | 6 | 5 | 3 | 3 | 4 | 65 m/min |

* **Regras de Bloqueio**:
  - Trecho com escada (`escada = true`) é intransponível se `evita_escada = true`.
  - Ponto ou trecho com `bloqueado = true` é intransponível para todos os perfis.

---

## 🤖 2. Pilha de Decisão do Assistente Conversacional (`AC_CONVERSA`)

Ao receber uma pergunta em `POST /eventos/{evento}/conversa`, o banco aplica a seguinte precedência determinística:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Regra de Segurança / Emergência (ex: fogo, evacuar)       │
├─────────────────────────────────────────────────────────────┤
│ 2. AI Vector Search (ONNX all_MiniLM_L12_v2 · Cosine < 0.42) │
├─────────────────────────────────────────────────────────────┤
│ 3. Match por Palavra-Chave / Sinônimos                      │
├─────────────────────────────────────────────────────────────┤
│ 4. Relevância Textual / TF-IDF Simplificado                 │
├─────────────────────────────────────────────────────────────┤
│ 5. Apoio OCI Generative AI (Llama 3.3 · Fallback Opcional)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 3. Detalhamento dos Endpoints da API

### 1. `GET /eventos`
* **Descrição**: Retorna a lista dos eventos disponíveis no banco.
* **Exemplo de Resposta**:
```json
{
  "items": [
    {
      "codigo": "NEXT26",
      "nome": "FIAP NEXT 2026",
      "descricao": "Festival de Inovação e Tecnologia FIAP",
      "largura_px": 1200,
      "altura_px": 800,
      "escala_m_px": 0.1,
      "largura_corredor_m": 4.0,
      "origem_padrao": "wp_entrance_main"
    },
    {
      "codigo": "EXPO26",
      "nome": "Expo Inclusão 2026",
      "descricao": "Feira Internacional de Tecnologias Assistivas",
      "largura_px": 1000,
      "altura_px": 700,
      "escala_m_px": 0.12,
      "largura_corredor_m": 4.5,
      "origem_padrao": "entrance-main"
    }
  ]
}
```

---

### 2. `GET /eventos/{evento}`
* **Parâmetros**: `evento` (path, string - ex: `NEXT26`).
* **Descrição**: Retorna o grafo completo do evento (pontos, trechos, áreas, perfis, programação e status de evacuação).
* **Campos Principais**:
  - `evento`: Metadados do pavilhão e escala.
  - `perfis`: Configurações de pesos e limites dos 4 perfis.
  - `areas`: Zonas e stands com coordenadas e cores.
  - `pontos`: Nós de passagem com tags para busca textual e vetorial.
  - `trechos`: Arestas com distâncias, nível de ruído (1–5) e lotação (1–5).
  - `programacao`: Grade de palestras e workshops com horário e previsão de ruído.

---

### 3. `GET /eventos/{evento}/rota`
* **Parâmetros Query**:
  - `perfil`: `PADRAO` | `CADEIRANTE` | `MOBILIDADE` | `NEURODIVERGENTE`
  - `origem`: ID do ponto de partida (ex: `poi_oracle`)
  - `destino`: ID do ponto de chegada (ex: `poi_quiet_room`)
* **Exemplo de Resposta**:
```json
{
  "sucesso": true,
  "evento": "NEXT26",
  "perfil": "CADEIRANTE",
  "origem": "poi_oracle",
  "destino": "poi_quiet_room",
  "distancia_m": 152.0,
  "tempo_estimado_min": 2.8,
  "custo_ponderado": 214.6,
  "caminho": ["poi_oracle", "wp_corredor_400", "wp_lobby_center", "wp_elevator_f1", "poi_quiet_room"],
  "multidao_m": 0.0,
  "ruido_max": 2,
  "degraus_evitados": 24,
  "explicacao": "Trajeto 100% livre de degraus. Utiliza o elevador acessível no lobby central e desvia do corredor 200.",
  "instrucoes": [
    { "passo": 1, "texto": "Saia do Stand Oracle e siga pela Alameda 400 por 6 metros.", "distancia_m": 6.0 },
    { "passo": 2, "texto": "Vire à direita em direção ao Lobby Central.", "distancia_m": 22.0 },
    { "passo": 3, "texto": "Utilize o Elevador Acessível para subir ao Mezanino.", "distancia_m": 12.0 },
    { "passo": 4, "texto": "Siga por 25 metros até a Sala de Acolhimento Sensorial.", "distancia_m": 25.0 }
  ]
}
```

---

### 4. `GET /eventos/{evento}/comparar`
* **Parâmetros Query**: `origem`, `destino`
* **Descrição**: Executa o cálculo para os quatro perfis simultaneamente e retorna a matriz comparativa.
* **Exemplo de Retorno**:
```json
{
  "origem": "poi_oracle",
  "destino": "poi_quiet_room",
  "comparacoes": [
    { "perfil": "PADRAO", "distancia_m": 84.0, "tempo_min": 1.2, "degraus": true, "multidao_m": 18.0 },
    { "perfil": "CADEIRANTE", "distancia_m": 152.0, "tempo_min": 2.8, "degraus": false, "multidao_m": 0.0 },
    { "perfil": "MOBILIDADE", "distancia_m": 84.0, "tempo_min": 1.7, "degraus": false, "multidao_m": 0.0 },
    { "perfil": "NEURODIVERGENTE", "distancia_m": 112.0, "tempo_min": 1.7, "degraus": false, "multidao_m": 0.0 }
  ]
}
```

---

### 5. `GET /eventos/{evento}/saida`
* **Parâmetros Query**: `perfil`, `origem`
* **Descrição**: Localiza a saída de emergência mais próxima e transitável para as necessidades do perfil especificado.

---

### 6. `POST /eventos/{evento}/conversa`
* **Request Body**:
```json
{
  "texto": "Onde posso descansar em silêncio?",
  "origem": "poi_main_stage",
  "perfil": "NEURODIVERGENTE",
  "registrar": true
}
```
* **Response**:
```json
{
  "resposta": "A Sala de Acolhimento Sensorial fica no Piso 2 (Mezanino). É um ambiente com iluminação suave, isolamento acústico e abafadores de som.",
  "intencao": "LOCALIZAR_ACOLHIMENTO",
  "faq_id": 104,
  "confianca": 0.96,
  "explicacao": {
    "metodo": "VECTOR_SEARCH",
    "distancia_vetorial": 0.14,
    "apoio_ia_generativa": false
  },
  "acao": {
    "tipo": "TRACAR_ROTA",
    "destino": "poi_quiet_room",
    "automatica": false
  },
  "sugestoes": [
    "Como chego lá pelo caminho mais silencioso?",
    "Onde retirar abafadores de ruído?"
  ]
}
```

---

### 7. `POST /eventos/{evento}/assistente`
* **Request Body**: `{ "texto": "quero ir de cadeira de rodas do stand da oracle ate a sala de acolhimento" }`
* **Response**:
```json
{
  "necessidade": "CADEIRANTE_SEM_DEGRAUS",
  "perfil_sugerido": "CADEIRANTE",
  "origem_detectada": "poi_oracle",
  "destino_detectado": "poi_quiet_room",
  "confianca": 0.93,
  "metodo": "VECTOR_SEARCH"
}
```

---

### 8. `POST /eventos/{evento}/reportes`
* **Request Body**:
```json
{
  "ponto": "wp_stairs_f1",
  "tipo": "BLOQUEIO",
  "descricao": "Elevador em manutenção preventiva"
}
```
* **Tipos Válidos**: `CHEIO` | `BARULHO` | `BLOQUEIO` | `LIBERADO`
* **Efeito**: Recalcula instantaneamente os pesos dos trechos adjacentes no grafo.

---

### 9. `POST /eventos/{evento}/sensores`
* **Requer PIN**: `"pin": "2026"`
* **Request Body**:
```json
{
  "pin": "2026",
  "leituras": [
    { "trecho": "tr_corredor_200", "pessoas": 32 }
  ]
}
```
* **Cálculo**: $\text{densidade} = \frac{\text{pessoas}}{\text{distância} \times \text{largura}} \rightarrow \text{nível } 1\text{–}5$.

---

### 10. `GET /eventos/{evento}/painel`
* **Retorno**: KPIs de engajamento, distribuição de perfis, corredores com congestionamento e frases não compreendidas para curadoria.

---

### 11. `POST /eventos/{evento}/evacuacao`
* **Requer PIN**: `"pin": "2026"`
* **Request Body**:
```json
{
  "pin": "2026",
  "ativa": true,
  "mensagem": "Evacuação preventiva acionada. Siga as rotas iluminadas no mapa."
}
```

---

### 12. `POST /eventos/{evento}/decisoes`
* **Descrição**: Registra se o usuário seguiu a recomendação ou optou por caminho alternativo (`SEGUIU` | `OUTRA_OPCAO` | `TROCOU_PERFIL`).

---

### 13. `POST /eventos/{evento}/treino/ensinar`
* **Requer PIN**: `"pin": "2026"`
* **Descrição**: Grava um novo exemplo vetorizado (`VECTOR(384)`) diretamente no Oracle 26ai associado a uma intenção ou FAQ.

---

### 14. `GET /rotulos`
* **Descrição**: Devolve a lista de códigos de intenções e categorias de FAQs.

---

### 15. `GET /eventos/{evento}/tarefas`
* **Descrição**: Roteiro de testes de usabilidade estruturados (`T1_ROTA_SEM_ESCADA`, `T2_EVITAR_BARULHO`, etc.).

---

### 16. `POST /eventos/{evento}/validacao/participantes`
* **Request Body**: `{ "pseudonimo": "User_01", "perfil": "CADEIRANTE", "consentimento_lgpd": true }`

---

### 17. `POST /eventos/{evento}/validacao/execucoes`
* **Request Body**: `{ "participante_id": 101, "tarefa_id": 1, "tempo_segundos": 84.5, "sucesso": true }`

---

### 18. `POST /eventos/{evento}/reset`
* **Requer PIN**: `"pin": "2026"`
* **Descrição**: Restaura os níveis base do cenário para nova demonstração.

---

## 📴 4. Estratégia de Fallback para Modo Offline

Como a API remota pode ficar indisponível (ou sem conectividade no pavilhão):

1. **Timeout Curto**: Qualquer requisição para o ORDS utiliza timeout de **5 segundos**.
2. **Cópia Local de Dados**: O arquivo [`api-dump.json`](./api-dump.json) contém o estado completo do grafo, perfis, áreas, pontos, trechos e perguntas do FAQ.
3. **Motor Local Espelho (`pathfinding.ts`)**: O algoritmo de Dijkstra e o cálculo de custo por perfil no cliente React/TypeScript espelham rigorosamente os pacotes PL/SQL (`AC_ROTAS`), garantindo que o usuário continue traçando rotas e comparando perfis sem interrupção.
4. **Buffer de Reportes e Telemetria**: Reportes criados sem rede são armazenados localmente e sincronizados quando a conexão for restabelecida.

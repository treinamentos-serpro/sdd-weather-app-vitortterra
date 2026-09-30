# Backlog de Tarefas — Weather App

Tarefas derivadas de `plans/weather-app-plan.md` e rastreadas aos requisitos de `specs/weather-app-spec.md`. Os IDs indicam a ordem recomendada; dependências são explícitas e nenhuma tarefa deve apresentar dados meteorológicos fora do escopo MVP.

## Ordem de execução

Execute em ordem crescente de ID e só inicie uma tarefa quando todas as dependências estiverem concluídas. Intervalos de dependências como `T-14–T-20` incluem ambos os extremos. A sequência dos IDs é topológica: toda dependência tem ID menor que a tarefa dependente. Tarefas independentes podem ser paralelizadas somente quando seus arquivos não se sobrepõem; quando há arquivo compartilhado, a dependência correspondente serializa as alterações (por exemplo, T-27 aguarda T-26 porque ambas editam `src/App.tsx`).

## Prioridade e tamanho

- **P0:** necessário para produzir a primeira experiência funcional visível. Concluir para demonstrar o fluxo principal.
- **P1:** necessário para completar e validar o MVP antes do release, mas pode vir após a primeira demonstração vertical. Não significa escopo opcional.
- **P2:** melhoria posterior, fora dos critérios de release do MVP. Não há tarefas P2 neste backlog: os requisitos atuais são todos escopo do MVP; itens futuros permanecem fora de escopo.
- **P (Pequeno):** escopo local, implementação direta e poucos casos.
- **M (Médio):** vários casos de comportamento ou integração de um módulo.
- **G (Grande):** coordenação de fluxo amplo ou validação integrada com maior risco.

## Sequência sugerida — fatias verticais

1. **Fatia 1 — Primeira previsão visível (P0):** concluir T-01–T-06; executar T-07–T-09 assim que suas dependências estiverem prontas; implementar T-10, depois T-11 e T-12; concluir T-13 e T-14; implementar T-15–T-20 e escrever T-22–T-24 à medida que cada componente estiver pronto; concluir T-21 para ligar busca, seleção, clima atual e cinco dias. O primeiro resultado demonstrável aparece ao concluir T-21; os testes da fatia continuam obrigatórios.
2. **Fatia 2 — Pronto para uso e release (P1):** após T-21, concluir T-25 e T-26; depois T-27, que compartilha `src/App.tsx` com T-26; executar T-28 para validar o fluxo completo; finalizar T-29 com os gates e a matriz de navegadores.

Dentro de cada fatia, respeite as dependências listadas nas tarefas; tarefas sem dependências pendentes e sem arquivos compartilhados podem avançar em paralelo.

## Decisões pendentes

- **Arredondamento (questão aberta 1 da spec):** definir a regra de exibição antes de fechar os critérios visuais de temperatura. A conversão interna deve manter precisão suficiente e usar uma única função de formatação após a decisão.
- **Persistência de unidade (questão aberta 5):** `T-14` inclui persistência local somente se aprovada. Sem aprovação, manter a preferência em memória; em ambos os casos, iniciar em Celsius quando não houver preferência válida.
- **Chamadas diretas (questão aberta 6):** confirmar CORS e limites da Open-Meteo antes do release; o plano assume chamadas HTTPS do navegador.
- **Cache (questão aberta 7):** deduplicar consultas enquanto houver resposta válida na sessão, sem persistir previsão. Definir validade se a sessão exigir atualização.

## Entrega 1 — Fundamentos e normalização

### T-01 — Definir os tipos do domínio meteorológico
- **Prioridade:** P0
- **Tamanho:** M
- **Tipo:** Data
- **Descrição:** Criar contratos internos para unidade, cidade, clima atual, dia de previsão e dados agregados, mantendo os tipos externos separados.
- **Critérios de aceite:** `tsc` em modo strict conclui sem erros; `Unit` aceita somente Celsius/Fahrenheit; `City` exige id, nome e coordenadas numéricas finitas; clima atual exige temperatura, condição, instante e timezone; `WeatherData` exige cidade, clima atual, cinco dias e instante de consulta; metadados opcionais permanecem opcionais.
- **Dependências:** —
- **Arquivos:** `src/types/weather.ts`
- **Requisitos:** RF03, RF07–RF17, RF22, NFR06, NFR19

### T-02 — Validar e normalizar a consulta de cidade
- **Prioridade:** P0
- **Tamanho:** P
- **Tipo:** Data
- **Descrição:** Implementar função pura que remove espaços externos, valida entrada vazia/curta e prepara texto seguro para geocodificação.
- **Critérios de aceite:** Testes unitários confirmam que vazio, apenas espaços e entrada de 1 caractere são rejeitados e entrada de 2 caracteres é aceita; espaços externos são removidos; acentos e caracteres especiais são preservados na consulta normalizada e codificados corretamente na URL; entrada nunca é interpretada como HTML ou código.
- **Dependências:** —
- **Arquivos:** `src/lib/search.ts`
- **Requisitos:** RF01, RF05, NFR02, NFR15

### T-03 — Implementar conversão e formatação de temperatura
- **Prioridade:** P0
- **Tamanho:** P
- **Tipo:** Data
- **Descrição:** Criar funções puras para converter Celsius/Fahrenheit e formatar valores com a regra de arredondamento aprovada.
- **Critérios de aceite:** Testes confirmam `toFahrenheit(0) = 32`, `toFahrenheit(100) = 212` e `toFahrenheit(-40) = -40`; conversões não arredondam o valor interno; formatter retorna valor e símbolo coerentes com C/F e aplica a regra registrada para a questão aberta 1. A tarefa não pode ser aprovada até essa regra estar registrada.
- **Dependências:** T-01
- **Arquivos:** `src/lib/temperature.ts`
- **Requisitos:** RF14–RF16, NFR19

### T-04 — Mapear códigos WMO para condições em pt-BR
- **Prioridade:** P0
- **Tamanho:** M
- **Tipo:** Data
- **Descrição:** Implementar mapeamento puro dos códigos WMO usados pela Open-Meteo para rótulos e representação visual apropriada.
- **Critérios de aceite:** Testes cobrem todos os códigos WMO `0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99`; cada um retorna rótulo pt-BR; um código fora dessa lista retorna rótulo genérico sem incluir o número recebido.
- **Dependências:** —
- **Arquivos:** `src/lib/weatherCode.ts`
- **Requisitos:** RF08, RF10, RF12, NFR19

### T-05 — Formatar datas no fuso da cidade
- **Prioridade:** P0
- **Tamanho:** M
- **Tipo:** Data
- **Descrição:** Criar funções puras para formatar a referência temporal e rotular os dias da previsão usando as datas civis e o timezone retornados pelo provedor.
- **Critérios de aceite:** Com relógio fixado e timezone da cidade fornecido, testes confirmam que a data civil `YYYY-MM-DD` não muda ao executar em timezone diferente; a data que corresponde ao hoje local recebe “Hoje”; quando horário ou fuso estiver ausente, formatter não produz valor inventado.
- **Dependências:** T-01
- **Arquivos:** `src/lib/date.ts`
- **Requisitos:** RF09, RF11, RF13, NFR19

### T-06 — Normalizar e validar respostas meteorológicas
- **Prioridade:** P0
- **Tamanho:** M
- **Tipo:** Data
- **Descrição:** Transformar payloads externos em contratos internos e rejeitar dados essenciais ausentes ou previsões diárias inconsistentes.
- **Critérios de aceite:** Fixtures provam que nome ausente, latitude/longitude não numéricas, temperatura ou medição ausente, timezone ausente, arrays desalinhados ou menos/mais de cinco datas resultam em erro de normalização; payload válido produz cinco dias ordenados; campos opcionais ausentes não aparecem no objeto normalizado.
- **Dependências:** T-01, T-04, T-05
- **Arquivos:** `src/lib/weatherMapper.ts`
- **Requisitos:** RF03, RF07–RF13, RF20, RF22, NFR06, NFR18

### T-07 — Implementar testes unitários de busca e temperaturas
- **Prioridade:** P0
- **Tamanho:** M
- **Tipo:** Test
- **Descrição:** Criar testes unitários para a validação da consulta e as conversões/formatação de temperatura.
- **Critérios de aceite:** Testes verificam os casos inválidos/válidos definidos em T-02, os três valores de conversão definidos em T-03 e pelo menos um valor fracionário em cada unidade; formatter corresponde exatamente à regra de arredondamento registrada para a questão aberta 1.
- **Dependências:** T-02, T-03
- **Arquivos:** `tests/unit/search.test.ts`, `tests/unit/temperature.test.ts`
- **Requisitos:** RF05, RF14–RF16, NFR15, NFR19, NFR20

### T-08 — Implementar testes unitários de códigos meteorológicos e datas
- **Prioridade:** P0
- **Tamanho:** M
- **Tipo:** Test
- **Descrição:** Criar testes unitários para o mapeamento WMO e a formatação de datas no timezone da cidade.
- **Critérios de aceite:** Um teste existe para cada código WMO listado em T-04 e para um código desconhecido; testes com relógio fixo verificam data civil sem deslocamento, rótulo “Hoje” no timezone fornecido e referência com data/horário/fuso disponíveis.
- **Dependências:** T-04, T-05
- **Arquivos:** `tests/unit/weatherCode.test.ts`, `tests/unit/date.test.ts`
- **Requisitos:** RF09, RF11–RF13, NFR19, NFR20

### T-09 — Implementar testes unitários de normalização meteorológica
- **Prioridade:** P0
- **Tamanho:** P
- **Tipo:** Test
- **Descrição:** Criar testes unitários para validação do payload externo e normalização para o modelo interno.
- **Critérios de aceite:** Testes individuais confirmam rejeição de nome/coordenada/clima atual/timezone obrigatórios ausentes, arrays desalinhados, zero a quatro datas e mais de cinco datas; uma fixture válida mantém ordem cronológica e outra sem opcionais não contém esses campos normalizados.
- **Dependências:** T-06
- **Arquivos:** `tests/unit/weatherMapper.test.ts`
- **Requisitos:** RF03, RF07–RF13, RF20, RF22, NFR06, NFR20

## Entrega 2 — Acesso a dados e estado

### T-10 — Implementar os serviços Open-Meteo
- **Prioridade:** P0
- **Tamanho:** M
- **Tipo:** Data
- **Descrição:** Criar operações de geocodificação e previsão com parâmetros definidos no plano, timeout, cancelamento e erros de domínio tratáveis.
- **Critérios de aceite:** Requisição de geocoding contém `count=5` e `language=pt`, e lista ausente/vazia retorna zero cidades; requisição de previsão usa as coordenadas selecionadas, Celsius, `timezone=auto` e `forecast_days=5`; HTTP não-2xx, JSON inválido, falha de rede e timeout de 10 s viram erros tratáveis; bundle cliente não contém chave privada e o service não envia consulta/coordenadas a logger.
- **Dependências:** T-01, T-02, T-06
- **Arquivos:** `src/services/openMeteo.ts`
- **Requisitos:** RF02, RF06–RF09, RF20, NFR04, NFR05, NFR17, NFR18, NFR20

### T-11 — Implementar testes unitários dos serviços Open-Meteo
- **Prioridade:** P0
- **Tamanho:** M
- **Tipo:** Test
- **Descrição:** Criar testes unitários com `fetch` simulado para contratos HTTP e falhas dos serviços, sem depender da disponibilidade da Open-Meteo.
- **Critérios de aceite:** Testes com `fetch` mockado verificam cada parâmetro das duas URLs e as respostas de sucesso, vazio, HTTP não-2xx, rejeição de rede, timeout de 10 s, JSON inválido e `AbortSignal`; nenhuma chamada real é feita.
- **Dependências:** T-10
- **Arquivos:** `tests/unit/openMeteo.test.ts`
- **Requisitos:** RF02, RF06–RF09, RF20, NFR04, NFR18, NFR20

### T-12 — Orquestrar busca, seleção e previsão no hook
- **Prioridade:** P0
- **Tamanho:** G
- **Tipo:** Data
- **Descrição:** Implementar estados independentes para geocodificação e previsão, seleção explícita, retry, concorrência e deduplicação em memória.
- **Critérios de aceite:** Testes de hook observam os estados `idle | loading | success | error | empty` separadamente para busca e previsão; busca vazia termina em `empty`, falha de previsão em `error`; selecionar cidade é ação explícita; retry mantém consulta/cidade; resposta da operação anterior não altera estado atual; duas consultas idênticas com cache válido causam uma chamada de service.
- **Dependências:** T-10
- **Arquivos:** `src/hooks/useWeather.ts`
- **Requisitos:** RF04–RF07, RF18–RF21, NFR01, NFR03, NFR05

### T-13 — Implementar testes unitários do hook de clima
- **Prioridade:** P0
- **Tamanho:** M
- **Tipo:** Test
- **Descrição:** Criar testes unitários com services simulados para transições de estado, seleção, retry e concorrência do fluxo de clima.
- **Critérios de aceite:** Testes controlam promises dos services e verificam: busca válida, vazia e inválida; seleção explícita; loading/success/error/empty; retry com a mesma consulta ou cidade; resolução fora de ordem mantém ativa a seleção mais recente; segunda consulta idêntica com resposta ainda válida não chama o service novamente.
- **Dependências:** T-12
- **Arquivos:** `tests/unit/useWeather.test.ts`
- **Requisitos:** RF04–RF07, RF18–RF21, NFR01, NFR03, NFR20

### T-14 — Gerenciar a unidade e a preferência local
- **Prioridade:** P0
- **Tamanho:** M
- **Tipo:** Data
- **Descrição:** Implementar preferência C/F usada em clima atual e previsão; persistir apenas a unidade se a decisão pendente for aprovada.
- **Critérios de aceite:** Testes confirmam Celsius sem preferência, setter C/F e fallback Celsius para valor local inválido; se a decisão da questão aberta 5 aprovar persistência, reabrir o hook restaura apenas a unidade de uma chave versionada e não grava cidade/consulta/previsão; se não aprovar, testes confirmam que nenhuma leitura/escrita em `localStorage` ocorre.
- **Dependências:** T-01, T-03
- **Arquivos:** `src/hooks/useUnitPreference.ts`
- **Requisitos:** RF14–RF17, NFR16, NFR19

## Entrega 3 — Interface e integração

### T-15 — Criar formulário acessível de busca
- **Prioridade:** P0
- **Tamanho:** P
- **Tipo:** UI
- **Descrição:** Implementar entrada e submissão manual, apresentando validação e mantendo a consulta editável.
- **Critérios de aceite:** Testing Library encontra o campo por label acessível; digitar sem submeter mantém zero chamadas; submeter entrada válida chama busca uma vez; vazio/1 caractere mantém zero chamadas e apresenta orientação associada ao campo; estado pendente expõe indicador com role `status`.
- **Dependências:** T-02, T-12
- **Arquivos:** `src/components/SearchForm.tsx`
- **Requisitos:** RF01, RF05, RF19, NFR02, NFR10, NFR11, NFR15

### T-16 — Exibir e permitir selecionar resultados de cidade
- **Prioridade:** P0
- **Tamanho:** P
- **Tipo:** UI
- **Descrição:** Apresentar opções de geocodificação com metadados disponíveis e seleção explícita por teclado ou ponteiro.
- **Critérios de aceite:** Fixtures com e sem `admin1`/país confirmam exibição apenas dos metadados disponíveis; ao renderizar múltiplos resultados, nenhum tem estado selecionado; ativar uma opção por teclado ou ponteiro chama seleção uma vez com o id e coordenadas daquela cidade.
- **Dependências:** T-01, T-12
- **Arquivos:** `src/components/CityResults.tsx`
- **Requisitos:** RF03, RF04, RF07, NFR07, NFR11

### T-17 — Apresentar estados de status e recuperação
- **Prioridade:** P0
- **Tamanho:** M
- **Tipo:** UI
- **Descrição:** Criar mensagens para orientação inicial, carregamento, lista vazia e falhas de busca/previsão, incluindo retry quando aplicável.
- **Critérios de aceite:** Testes verificam orientação inicial, loading, lista vazia e erro em pt-BR; loading usa role `status`, erro usa role `alert`; estado vazio mantém o texto pesquisado; retry de previsão chama novamente com a cidade selecionada; mensagem de erro identifica a próxima ação.
- **Dependências:** T-12
- **Arquivos:** `src/components/StatusMessage.tsx`
- **Requisitos:** RF06, RF18–RF21, NFR01, NFR05, NFR10, NFR11

### T-18 — Exibir condições meteorológicas atuais
- **Prioridade:** P0
- **Tamanho:** M
- **Tipo:** UI
- **Descrição:** Criar painel do clima atual com temperatura, condição, representação visual textual e referência da medição.
- **Critérios de aceite:** Com fixture conhecida, renderiza temperatura e símbolo na unidade ativa, rótulo da condição em pt-BR, texto alternativo/textual da representação visual e data/horário/fuso recebidos; fixture sem metadado opcional não renderiza placeholder com valor inventado nem sensação térmica.
- **Dependências:** T-01, T-03–T-05, T-14
- **Arquivos:** `src/components/CurrentWeatherPanel.tsx`
- **Requisitos:** RF07, RF08, RF12, RF13, RF16, RF22, NFR09

### T-19 — Exibir previsão diária de cinco dias
- **Prioridade:** P0
- **Tamanho:** M
- **Tipo:** UI
- **Descrição:** Criar lista de previsão cronológica com temperaturas mínima/máxima e condição de cada dia.
- **Critérios de aceite:** Teste de render confirma exatamente cinco itens na ordem das datas de entrada; com relógio e timezone fixos, somente a data de hoje local tem rótulo “Hoje”; cada item contém data, mínima, máxima, símbolo de unidade, condição e texto associado à representação visual; fixture sem opcionais renderiza sem erro ou valor inventado.
- **Dependências:** T-01, T-03–T-05, T-14
- **Arquivos:** `src/components/ForecastList.tsx`
- **Requisitos:** RF09–RF12, RF16, RF22, NFR09

### T-20 — Criar controle acessível de unidade
- **Prioridade:** P0
- **Tamanho:** P
- **Tipo:** UI
- **Descrição:** Permitir alternar Celsius/Fahrenheit e refletir visualmente a escolha ativa.
- **Critérios de aceite:** Controle expõe opções nomeadas °C/°F e estado selecionado semanticamente; teste de teclado alterna as opções; selecionar cada unidade atualiza temperatura atual e 5 mínimas/máximas; contador de chamadas do service não muda durante alternância.
- **Dependências:** T-03, T-14
- **Arquivos:** `src/components/UnitToggle.tsx`
- **Requisitos:** RF14–RF17, NFR07, NFR11

### T-21 — Compor a aplicação no App
- **Prioridade:** P0
- **Tamanho:** G
- **Tipo:** UI
- **Descrição:** Integrar hook, formulário, resultados, status, painel atual, previsão e unidade na tela principal.
- **Critérios de aceite:** Renderização inicial mostra orientação sem painel de clima; completar busca apresenta resultados sem selecionar cidade; selecionar resultado válido percorre loading até sucesso e mostra dados; fixtures vazio/erro mostram os estados correspondentes e retry mantém contexto; nenhuma resposta inválida renderiza valores meteorológicos.
- **Dependências:** T-12, T-14–T-20
- **Arquivos:** `src/App.tsx`
- **Requisitos:** RF01–RF22, NFR01, NFR05–NFR11

### T-22 — Implementar testes do componente de busca
- **Prioridade:** P0
- **Tamanho:** P
- **Tipo:** Test
- **Descrição:** Criar testes de componente para submissão manual, validação de entrada e feedback de carregamento do formulário.
- **Critérios de aceite:** Testes encontram o campo e botão por nome acessível; digitação isolada não chama callback; submit válido chama uma vez; submit vazio/curto não chama callback e expõe orientação; loading torna-se localizável por role `status`.
- **Dependências:** T-15
- **Arquivos:** `tests/components/SearchForm.test.tsx`
- **Requisitos:** RF01, RF05, RF19, NFR02, NFR10, NFR11, NFR20

### T-23 — Implementar testes de seleção de cidades e estados
- **Prioridade:** P0
- **Tamanho:** M
- **Tipo:** Test
- **Descrição:** Criar testes de componente para apresentação/seleção dos resultados e mensagens de loading, vazio e erro.
- **Critérios de aceite:** Testes verificam exibição/omissão de região e país conforme fixtures, zero opção selecionada inicialmente, seleção envia id/coordenadas corretos, vazio preserva a consulta, erro de previsão oferece alerta e retry mantém a cidade selecionada.
- **Dependências:** T-16, T-17
- **Arquivos:** `tests/components/CityResults.test.tsx`, `tests/components/StatusMessage.test.tsx`
- **Requisitos:** RF03–RF06, RF18–RF21, NFR01, NFR07, NFR10, NFR11, NFR20

### T-24 — Implementar testes de apresentação do clima e unidade
- **Prioridade:** P0
- **Tamanho:** M
- **Tipo:** Test
- **Descrição:** Criar testes de componente para conteúdo meteorológico atual, previsão e alternância de unidade.
- **Critérios de aceite:** Testes verificam temperatura/condição/horário/fuso atuais, exatamente cinco itens cronológicos, ausência de opcionais sem valor inventado e conversão C/F do valor atual e dos dez limites diários; alternância não incrementa chamadas de service.
- **Dependências:** T-18–T-20
- **Arquivos:** `tests/components/WeatherView.test.tsx`
- **Requisitos:** RF07–RF17, RF22, NFR09, NFR20

## Entrega 4 — Acessibilidade, responsividade e validação integrada

### T-25 — Validar teclado e seleção acessível
- **Prioridade:** P1
- **Tamanho:** M
- **Tipo:** UI
- **Descrição:** Verificar e corrigir navegação por teclado e foco no fluxo de busca e seleção de cidade.
- **Critérios de aceite:** Teste de teclado percorre campo, submissão e opções de cidade sem usar ponteiro; cada foco tem indicador visível; ativar resultado com Enter ou Espaço seleciona a opção focada e inicia a consulta correspondente.
- **Dependências:** T-16, T-21
- **Arquivos:** `src/components/SearchForm.tsx`, `src/components/CityResults.tsx`
- **Requisitos:** AC07.2, NFR07, NFR11

### T-26 — Validar anúncios e recuperação acessível de estado
- **Prioridade:** P1
- **Tamanho:** M
- **Tipo:** UI
- **Descrição:** Ajustar semântica de anúncios e foco para loading, erro, vazio e retry.
- **Critérios de aceite:** DOM expõe loading em `role=status` e erro em `role=alert`; erro contém ação de retry; texto de condição/estado permanece presente sem CSS/cor/ícone; teste de teclado confirma foco no controle acionado após retry e sem salto para o início da página.
- **Dependências:** T-17, T-21
- **Arquivos:** `src/components/StatusMessage.tsx`, `src/App.tsx`
- **Requisitos:** AC07.2, AC07.3, NFR07, NFR10, NFR11

### T-27 — Ajustar layout para viewports móveis
- **Prioridade:** P1
- **Tamanho:** M
- **Tipo:** UI
- **Descrição:** Corrigir composição e estilos globais para telas estreitas e orientação retrato/paisagem.
- **Critérios de aceite:** Em viewports 320×568 e 568×320, `document.documentElement.scrollWidth` não excede `clientWidth`; busca, seleção, unidade e retry permanecem visíveis e acionáveis em retrato e paisagem; medições dos controles atendem ao alvo mínimo aplicável da WCAG 2.2 AA.
- **Dependências:** T-21, T-26
- **Arquivos:** `src/App.tsx`, `src/index.css`
- **Requisitos:** AC07.1, AC07.4, NFR12, NFR13

### T-28 — Implementar testes E2E dos fluxos principais
- **Prioridade:** P1
- **Tamanho:** G
- **Tipo:** Test
- **Descrição:** Criar e manter cenários Playwright com APIs interceptadas para fluxos principais, falhas, concorrência e viewport móvel.
- **Critérios de aceite:** Playwright intercepta ambas as APIs; asserts cobrem resultados e metadados, ausência de seleção automática, seleção, temperatura atual e exatamente cinco dias, vazio e retry, valores C/F sem requisição adicional, resposta obsoleta ignorada, “Hoje” com timezone diferente do navegador, operação por teclado e ausência de overflow em 320×568 e 568×320; nenhum teste chama serviço externo.
- **Dependências:** T-21, T-25–T-27
- **Arquivos:** `tests/e2e/weather.spec.ts`
- **Requisitos:** RF01–RF22, AC01.1–AC07.4, NFR04, NFR12–NFR14, NFR20

### T-29 — Executar gates de qualidade para release
- **Prioridade:** P1
- **Tamanho:** M
- **Tipo:** Infra
- **Descrição:** Confirmar os scripts de qualidade configurados e executar lint, build, testes unitários e E2E antes da publicação.
- **Critérios de aceite:** `pnpm lint`, `pnpm build`, `pnpm test` e `pnpm test:e2e` terminam com exit code 0; registrar navegador, versão e resultado para versões atuais de Chrome, Firefox, Safari e Edge e ao menos um navegador móvel definido para release; matriz/versões são registradas antes da aprovação, sem declarar compatibilidade não testada.
- **Dependências:** T-07–T-09, T-11, T-13, T-22–T-24, T-28
- **Arquivos:** `package.json`, `playwright.config.ts`
- **Requisitos:** NFR14, NFR21

## Rastreabilidade — requisitos funcionais

| Requisito | Tarefas de implementação | Cobertura |
|---|---|---|
| RF01 | T-02, T-10, T-12, T-15, T-21 | Coberto |
| RF02 | T-10, T-12, T-16, T-21 | Coberto |
| RF03 | T-06, T-16, T-21 | Coberto |
| RF04 | T-12, T-16, T-21 | Coberto |
| RF05 | T-02, T-12, T-15, T-17, T-21 | Coberto |
| RF06 | T-10, T-12, T-17, T-21 | Coberto |
| RF07 | T-10, T-12, T-18, T-21 | Coberto |
| RF08 | T-03, T-04, T-06, T-18, T-21 | Coberto |
| RF09 | T-05, T-06, T-10, T-19, T-21 | Coberto |
| RF10 | T-03, T-04, T-19, T-21 | Coberto |
| RF11 | T-05, T-06, T-19, T-21 | Coberto |
| RF12 | T-04, T-06, T-18, T-19, T-21 | Coberto |
| RF13 | T-05, T-06, T-18, T-21 | Coberto |
| RF14 | T-03, T-14, T-20, T-21 | Coberto |
| RF15 | T-03, T-14, T-20, T-21 | Coberto |
| RF16 | T-03, T-14, T-18–T-21 | Coberto |
| RF17 | T-14 | Coberto condicionalmente à decisão de habilitar persistência local |
| RF18 | T-17, T-21 | Coberto |
| RF19 | T-12, T-15, T-17, T-21 | Coberto |
| RF20 | T-06, T-10, T-12, T-17, T-21 | Coberto |
| RF21 | T-12, T-17, T-21 | Coberto |
| RF22 | T-06, T-18, T-19, T-21 | Coberto |

**Lacunas:** nenhum requisito funcional RF01–RF22 está sem tarefa de implementação correspondente. RF17 permanece condicional: T-14 implementa a persistência se aprovada; caso contrário, mantém a unidade apenas em memória, conforme a decisão registrada na spec.

## Rastreabilidade — requisitos não funcionais

| Requisito | Tarefas |
|---|---|
| NFR01–NFR06 | T-10–T-13, T-15, T-17, T-21–T-24, T-28 |
| NFR07–NFR11 | T-15–T-18, T-20–T-26, T-28 |
| NFR12–NFR14 | T-27–T-29 |
| NFR15–NFR17 | T-02, T-10, T-14, T-15 |
| NFR18–NFR20 | T-01, T-04–T-13, T-22–T-24, T-28 |
| NFR21 | T-29 |
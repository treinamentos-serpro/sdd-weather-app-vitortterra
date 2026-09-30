# Especificação do Produto: Weather App

## 1. Overview

O Weather App é uma aplicação web responsiva, em pt-BR, para consulta rápida do clima de uma cidade. O usuário busca uma localidade, escolhe explicitamente o resultado correto, consulta as condições atuais e visualiza a previsão diária de cinco dias. A fonte de dados do MVP é a Open-Meteo, sem autenticação, sem API key e sem persistência de dados em servidor.

O público principal é uma pessoa que precisa consultar o clima antes de sair, planejar o dia ou tomar uma decisão simples. O MVP prioriza clareza, confiabilidade percebida, acessibilidade e uso em dispositivos móveis.

**Definição de cinco dias:** o dia atual mais os quatro dias seguintes, calculados conforme o fuso horário da cidade consultada.

## 2. Functional Requirements

### Busca e seleção de cidade

- **RF01.** Permitir informar o nome de uma cidade para pesquisa.
- **RF02.** Consultar o serviço de geocodificação da Open-Meteo e apresentar resultados compatíveis.
- **RF03.** Exibir, em cada resultado, cidade, região ou estado e país quando disponíveis.
- **RF04.** Exigir seleção explícita do usuário; não selecionar automaticamente o primeiro resultado.
- **RF05.** Exigir pelo menos dois caracteres e preservar o texto informado quando não houver resultados ou houver falha.
- **RF06.** Informar quando nenhuma cidade for encontrada e permitir nova tentativa sem recarregar a página.

### Clima atual e previsão

- **RF07.** Após a seleção, consultar e exibir o clima atual da cidade escolhida.
- **RF08.** Exibir no clima atual, no mínimo, temperatura, unidade, condição textual em pt-BR, representação visual acompanhada de texto e horário da medição. A temperatura aparente não faz parte do MVP enquanto não houver decisão explícita de produto.
- **RF09.** Exibir exatamente cinco datas de previsão, em ordem cronológica.
- **RF10.** Exibir para cada dia data, temperatura mínima, temperatura máxima, condição textual em pt-BR e representação visual acompanhada de texto.
- **RF11.** Identificar o dia atual como “Hoje” e defini-lo segundo o fuso horário da cidade consultada.
- **RF12.** Converter códigos meteorológicos da Open-Meteo para descrições em pt-BR; códigos desconhecidos devem gerar descrição genérica sem expor o código técnico.
- **RF13.** Exibir data, horário e fuso de referência dos dados retornados.

### Unidades e preferências

- **RF14.** Usar Celsius (°C) como unidade inicial.
- **RF15.** Permitir alternância entre Celsius (°C) e Fahrenheit (°F).
- **RF16.** Atualizar consistentemente o clima atual e todos os valores da previsão após a troca de unidade.
- **RF17.** Se a persistência local for habilitada para o MVP, armazenar somente a unidade escolhida no navegador, sem sincronização entre dispositivos e sem servidor; a ausência dessa preferência deve usar Celsius.

### Estados e falhas

- **RF18.** Exibir estado inicial orientando a busca quando nenhuma cidade estiver selecionada.
- **RF19.** Exibir indicador de carregamento durante a busca de cidade e a consulta meteorológica.
- **RF20.** Informar falhas de conexão, timeout, indisponibilidade da Open-Meteo e respostas inválidas ou incompletas.
- **RF21.** Permitir nova tentativa manual sem perder o contexto da cidade selecionada, quando aplicável.
- **RF22.** Não apresentar valores ausentes como válidos nem quebrar a interface quando campos opcionais estiverem ausentes.

## 3. User Stories

- **US01 — Busca:** Como usuário cotidiano, quero informar o nome de uma cidade para encontrar sua previsão do tempo rapidamente.
- **US02 — Desambiguação:** Como viajante, quero escolher entre resultados com cidade, região e país para consultar a localidade correta durante meu planejamento.
- **US03 — Clima atual:** Como trabalhador externo, quero ver as condições atuais da cidade escolhida para decidir como me preparar para o trabalho.
- **US04 — Previsão:** Como pessoa que planeja atividades ao ar livre, quero ver a previsão de hoje e dos quatro dias seguintes para planejar minhas atividades com antecedência.
- **US05 — Unidade:** Como usuário internacional, quero alternar entre Celsius e Fahrenheit para interpretar a temperatura na unidade que conheço.
- **US06 — Estados da interface:** Como usuário cotidiano, quero receber feedback durante carregamentos e falhas para entender o que está acontecendo e o que posso fazer.
- **US07 — Uso móvel e acessível:** Como viajante, quero usar o fluxo principal em meu dispositivo móvel para consultar o clima com controles legíveis, navegáveis e compreensíveis.
- **US08 — Privacidade:** Como usuário internacional, quero consultar o clima sem criar conta para preservar minha privacidade e evitar o armazenamento dos meus dados em servidor.

## 4. Acceptance Criteria

### US01 — Busca

- **AC01.1 (RF01):** Dado o estado inicial, quando o usuário informa um nome de cidade e inicia a busca, então o sistema inicia uma consulta de geocodificação.
- **AC01.2 (RF02):** Dado uma consulta válida, quando a geocodificação responde, então o sistema apresenta os resultados compatíveis.
- **AC01.3 (RF05):** Dado um texto com menos de dois caracteres, quando o usuário tenta buscar, então nenhuma consulta é enviada e uma orientação clara é exibida.
- **AC01.4 (RF05, RF06):** Dado um texto com pelo menos dois caracteres e nenhum resultado, quando a consulta termina, então o sistema informa que nenhuma cidade foi encontrada, preserva o texto e permite nova busca sem recarregar.

### US02 — Desambiguação

- **AC02.1 (RF03):** Dado um resultado com metadados disponíveis, quando ele é exibido, então mostra cidade e também região/estado e país quando retornados.
- **AC02.2 (RF04):** Dado mais de um resultado, quando a busca termina, então nenhum resultado é selecionado automaticamente.
- **AC02.3 (RF04):** Dado um resultado exibido, quando o usuário o seleciona, então ele se torna a cidade ativa e o sistema inicia a consulta meteorológica correspondente.

### US03 — Clima atual

- **AC03.1 (RF07):** Dado uma cidade selecionada, quando a consulta meteorológica termina com sucesso, então o clima atual da localidade é exibido.
- **AC03.2 (RF08):** Dado uma resposta com dados atuais válidos, quando o painel é renderizado, então exibe temperatura, unidade, condição textual, representação visual acompanhada de texto e horário da medição, sem exibir temperatura aparente como requisito do MVP.
- **AC03.3 (RF12):** Dado qualquer código meteorológico conhecido, quando os dados são apresentados, então a condição correspondente aparece em pt-BR.
- **AC03.4 (RF12):** Dado um código meteorológico desconhecido, quando os dados são apresentados, então aparece uma descrição genérica em pt-BR e o código técnico não é mostrado.
- **AC03.5 (RF13):** Dado uma resposta com fuso horário, quando os dados são apresentados, então a referência temporal identifica data, horário e fuso retornados.

### US04 — Previsão

- **AC04.1 (RF09):** Dado uma resposta diária válida, quando a previsão é exibida, então existem exatamente cinco datas em ordem cronológica: hoje e os quatro dias seguintes.
- **AC04.2 (RF10):** Dado cada dia da previsão, quando o cartão/linha é exibido, então contém data, mínima, máxima, condição textual em pt-BR e representação visual acompanhada de texto.
- **AC04.3 (RF11):** Dado o dia correspondente à data atual no fuso da cidade, quando a previsão é exibida, então esse dia é identificado como “Hoje”.
- **AC04.4 (RF22):** Dado um campo opcional ausente, quando a previsão é exibida, então o campo não é inventado nem causa quebra da interface.

### US05 — Unidade

- **AC05.1 (RF14):** Dado um navegador sem preferência armazenada, quando a aplicação é aberta, então os valores são exibidos em °C.
- **AC05.2 (RF15):** Dado o clima exibido, quando o usuário alterna para °F ou °C, então o controle indica a unidade ativa.
- **AC05.3 (RF16):** Dado uma troca de unidade, quando a atualização termina, então temperatura atual, mínima e máxima da previsão usam a nova unidade de forma consistente.
- **AC05.4 (RF17):** Dado que a persistência local está habilitada e existe uma preferência de unidade armazenada, quando a aplicação é reaberta no mesmo navegador, então essa preferência é restaurada sem enviar dados a um servidor; sem preferência válida, então a unidade usada é Celsius.

### US06 — Estados da interface

- **AC06.1 (RF18):** Dado que nenhuma cidade foi selecionada, quando a aplicação é aberta, então exibe orientação para buscar uma cidade.
- **AC06.2 (RF19):** Dado o início de uma busca de cidade ou consulta meteorológica, quando a operação está pendente, então exibe um indicador de carregamento.
- **AC06.3 (RF20):** Dado uma falha de rede, timeout, status HTTP não bem-sucedido, indisponibilidade ou resposta inválida/incompleta, quando a operação termina, então exibe uma mensagem de erro clara em pt-BR.
- **AC06.4 (RF21):** Dado um erro meteorológico para uma cidade já selecionada, quando o usuário solicita nova tentativa, então a tentativa é repetida sem apagar o contexto da cidade.
- **AC06.5 (RF22):** Dado qualquer valor ausente ou opcional não retornado, quando a tela é renderizada, então não exibe o valor como válido e permanece utilizável.

### US07 — Uso móvel e acessível

- **AC07.1 (RNF03, RNF04):** Dado viewport de 320 px ou maior, em retrato ou paisagem, quando o fluxo é utilizado, então não há rolagem horizontal e os controles permanecem utilizáveis.
- **AC07.2 (RNF07, RNF08):** Dado o fluxo principal, quando navegado apenas por teclado, então busca, resultados, seleção, unidade, nova tentativa e conteúdo relevante têm ordem lógica, foco visível e semântica adequada.
- **AC07.3 (RNF09, RNF10):** Dada uma condição meteorológica ou mudança relevante de estado, quando comunicada, então há descrição textual e comunicação compatível com tecnologia assistiva, sem depender apenas de cor ou ícone.
- **AC07.4 (RNF11):** Dado um dispositivo móvel, quando o usuário interage com controles, então as áreas de toque são adequadas e não exigem precisão excessiva.

### US08 — Privacidade

- **AC08.1 (RNF18, RNF20):** Dada qualquer consulta ao provedor, quando a requisição é realizada, então não há chave privada no cliente e a comunicação usa HTTPS.
- **AC08.2 (RNF21, RNF22):** Dada uma sessão de uso, quando consultas e preferências são processadas, então não é exigida autenticação nem há armazenamento de dados do usuário em servidor; eventual preferência local não contém informação pessoal desnecessária.

## 5. Non-Functional Requirements

### Performance e resiliência

- **NFR01:** Exibir feedback de carregamento imediatamente após cada operação assíncrona.
- **NFR02:** A busca manual não deve enviar requisições enquanto o usuário digita; caso uma experiência de resultados durante a digitação seja adicionada ao MVP, aplicar debounce de aproximadamente 300 ms ou mecanismo equivalente.
- **NFR03:** Evitar chamadas duplicadas para a mesma consulta enquanto houver resposta válida disponível na sessão.
- **NFR04:** Configurar timeout de 10 segundos para chamadas à Open-Meteo e tratar falhas de rede e status HTTP não bem-sucedidos.
- **NFR05:** A indisponibilidade do provedor não pode travar nem quebrar a interface.
- **NFR06:** Validar e normalizar respostas antes de entregá-las à apresentação.

### Acessibilidade e usabilidade

- **NFR07:** Atender, no mínimo, aos critérios aplicáveis da WCAG 2.2 nível AA.
- **NFR08:** O fluxo de busca e consulta deve ser compreensível sem treinamento prévio.
- **NFR09:** Dar prioridade visual ao clima atual e tornar a previsão facilmente escaneável.
- **NFR10:** Usar mensagens de erro claras, em pt-BR, que orientem a próxima ação.
- **NFR11:** Garantir nomes, papéis, estados, foco visível e ordem lógica para controles, resultados, carregamento e erros.

### Responsividade e compatibilidade

- **NFR12:** Funcionar em smartphones, tablets e desktops, sem rolagem horizontal a partir de 320 px.
- **NFR13:** Funcionar em orientações retrato e paisagem.
- **NFR14:** Validar o MVP nas versões atuais de Chrome, Firefox, Safari e Edge, incluindo navegadores móveis relevantes.

### Segurança, privacidade e manutenção

- **NFR15:** Validar, limitar e tratar entradas antes de usá-las em consultas ou renderizá-las.
- **NFR16:** Não coletar dados pessoais além do necessário para a busca; não armazenar dados do usuário em servidor.
- **NFR17:** Não registrar em logs dados pessoais ou localização além do necessário para diagnóstico.
- **NFR18:** Isolar a integração com geocodificação e previsão em uma camada de serviço substituível.
- **NFR19:** Manter regras de conversão, incluindo arredondamento quando definido, mapeamento meteorológico e transformação de respostas testáveis independentemente da UI.
- **NFR20:** Possuir testes automatizados para busca, seleção, previsão, troca de unidade e estados de erro, vazio e carregamento.
- **NFR21:** Executar lint, build e testes antes da publicação.

## 6. Edge Cases

- **Cidade inexistente:** quando o usuário pesquisar uma cidade que não existe ou não puder ser localizada, o sistema deve informar que nenhuma cidade foi encontrada, preservar a busca e permitir nova tentativa.
- **String vazia:** quando o campo contiver vazio ou apenas espaços, o sistema não deve chamar o geocoding e deve orientar o usuário a informar uma cidade.
- **Entrada curta:** quando a busca tiver menos de dois caracteres, o sistema não deve consultar a API e deve exibir a regra mínima de entrada.
- **Caracteres especiais:** quando a entrada contiver caracteres especiais, acentos ou conteúdo potencialmente malformado, o sistema deve validar e normalizar o valor antes da consulta, sem quebrar a interface nem executar conteúdo como código.
- **Falha de API:** quando a Open-Meteo retornar falha de rede, status HTTP não bem-sucedido ou estiver indisponível, o sistema deve exibir erro claro em pt-BR e oferecer nova tentativa manual.
- **Timeout:** quando uma chamada exceder 10 segundos sem resposta, o sistema deve interromper a espera, informar que a consulta demorou além do limite e permitir nova tentativa sem perder a cidade selecionada, quando houver.
- **Sem resultados de geocoding:** quando o serviço de geocoding responder com uma lista vazia, o sistema deve exibir estado vazio específico, preservar o texto pesquisado e não iniciar consulta meteorológica.
- **Resposta parcial:** quando a resposta da API estiver inválida ou sem coordenadas, timezone ou dados diários suficientes, o sistema não deve exibir valores como válidos; deve informar indisponibilidade dos dados sem quebrar a tela.
- **Campos opcionais ausentes:** quando um campo meteorológico opcional não for retornado, o sistema deve omiti-lo ou mostrar estado neutro, sem inventar valores; a temperatura aparente deve permanecer omitida no MVP.
- **Código meteorológico desconhecido:** quando receber código sem mapeamento, o sistema deve mostrar descrição genérica em pt-BR e ocultar o código técnico.
- **Requisições concorrentes:** quando respostas chegarem fora de ordem após novas buscas ou seleções, o sistema deve ignorar resposta obsoleta e manter os dados da cidade atualmente selecionada.
- **Fuso horário e virada de dia:** quando a cidade estiver em fuso diferente ou houver mudança de data local, o sistema deve calcular “Hoje” e as cinco datas usando o timezone retornado.
- **Preferência local inválida:** quando a unidade armazenada estiver ausente ou corrompida, o sistema deve usar Celsius como fallback.
- **Viewport pequeno:** quando usado em viewport de 320 px ou mais, em retrato ou paisagem, o sistema deve manter controles acessíveis e evitar rolagem horizontal.

## 7. Assumptions

- Open-Meteo oferece geocodificação, previsão diária, códigos meteorológicos e timezone necessários ao MVP.
- As chamadas diretas do navegador à Open-Meteo serão possíveis com CORS e limites compatíveis com o volume do MVP.
- A fonte não exige API key para o escopo definido.
- A unidade inicial será Celsius e a interface será exclusivamente em pt-BR.
- Cinco dias significa hoje mais os quatro dias seguintes.
- Busca manual atende ao MVP; geolocalização automática não é necessária.
- A previsão diária é suficiente; previsão horária não faz parte do MVP.
- Não haverá autenticação, contas, sincronização entre dispositivos ou persistência em servidor.
- A preferência de unidade poderá ser armazenada localmente sem dados pessoais desnecessários.
- Sensação térmica, vento, umidade, precipitação, pressão e visibilidade não são obrigatórios no MVP.

## 8. Risks

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Dados desatualizados serem interpretados como atuais | Média | Alto | Exibir horário e fuso da medição e não ocultar dados antigos. |
| Open-Meteo indisponível ou lenta | Média | Alto | Timeout, erro acionável, nova tentativa manual e integração substituível. |
| Seleção incorreta de cidade homônima | Média | Alto | Exibir região e país e exigir seleção explícita; testar homônimos. |
| Resposta incompleta ou mudança do contrato da API | Baixa/Média | Alto | Isolar serviço, validar schema, normalizar resposta e tratar ausência de campos. |
| Conversão de temperatura incorreta | Baixa | Alto | Centralizar regra, definir arredondamento no plano e testar as duas unidades. |
| Data ou timezone incorreto | Média | Alto | Usar timezone retornado, exibir referência e testar fusos distintos. |
| Excesso de requisições ou abuso do provedor | Média | Médio/Alto | Debounce, deduplicação, limite de resultados e monitoramento de consumo. |
| Experiência inadequada em telas pequenas | Média | Alto | Abordagem mobile-first e testes em viewports representativos. |
| Falhas de acessibilidade | Média | Alto | Validar WCAG, teclado, tecnologia assistiva e ferramentas automatizadas. |
| Entrada não confiável | Baixa/Média | Alto | Validar e limitar entradas e renderizar conteúdo com segurança. |
| Dependência excessiva de um provedor | Baixa/Média | Alto | Manter contrato interno normalizado e camada de serviço substituível. |
| Usuário tomar decisão crítica apenas com base na previsão | Média | Alto | Exibir fonte, horário e caráter informativo dos dados; não apresentar previsão como garantia. |

## 9. Out of Scope

- Autenticação, contas e perfis.
- Persistência de dados em servidor, favoritos e histórico.
- Geolocalização automática.
- Previsão horária.
- Alertas, notificações e avisos de condições severas.
- Mapas, radar e imagens de satélite.
- Aplicação nativa para Android ou iOS.
- Suporte a múltiplos idiomas.
- Temperatura aparente, vento, umidade, precipitação, pressão e visibilidade, salvo decisão explícita posterior de produto.

## 10. Open Questions

As decisões abaixo ainda não estão resolvidas. As perguntas de produto podem
alterar o escopo do MVP; as perguntas técnicas devem ser respondidas antes do
plano técnico definitivo.

1. Qual regra de arredondamento deve ser aplicada às temperaturas exibidas em
	Celsius e Fahrenheit?
2. O produto deverá oferecer avisos sobre condições severas ou será estritamente informativo?
3. Qual matriz exata de navegadores e versões será oficialmente suportada?
4. Qual meta de tempo de resposta deve ser usada para validar desempenho em rede móvel?
5. A persistência local da unidade será habilitada no MVP? A RF17 e o critério
	AC05.4 são condicionais até essa decisão.
6. As chamadas à Open-Meteo serão diretas do navegador ou passarão por proxy/backend? A recomendação atual é chamada direta, condicionada à confirmação de CORS e limites.
7. Será necessário cache local de dados meteorológicos? A recomendação atual é não persistir previsão no MVP e manter dados apenas em memória durante a sessão.
8. Qual ferramenta será usada para monitoramento de erros em produção?
9. Quais níveis de cobertura de testes serão exigidos para publicação?
10. A acessibilidade será validada apenas automaticamente ou também com testes manuais usando tecnologia assistiva?
11. Qual formato de data e horário em pt-BR será usado para apresentar a
	referência temporal, além da identificação do fuso?
12. Em versões futuras, haverá favoritos, histórico ou geolocalização automática?
13. Em versões futuras, haverá previsão horária, alertas, notificações ou suporte a outros idiomas?

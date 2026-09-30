# Discovery: Aplicação de Previsão do Tempo

## Contexto

A empresa deseja disponibilizar uma aplicação web responsiva para que usuários
consultem rapidamente as condições meteorológicas de uma cidade, especialmente
em dispositivos móveis.

O MVP deve permitir buscar uma cidade, visualizar o clima atual e consultar uma
previsão de cinco dias. Para este documento, cinco dias significa o dia atual
mais os quatro dias seguintes. A aplicação utilizará a Open-Meteo como fonte de
dados, sem API key, terá interface em pt-BR, iniciará com Celsius como unidade
padrão e não exigirá autenticação nem persistência de dados em servidor.

### Público e objetivo inicial

A persona primária é o usuário cotidiano que deseja consultar rapidamente o
clima antes de sair, planejar o dia ou tomar uma decisão simples. Viajantes,
usuários internacionais, trabalhadores externos e pessoas que planejam
atividades ao ar livre são personas secundárias a validar.

O objetivo do MVP é oferecer uma consulta confiável, compreensível e acessível
sem transformar a aplicação em uma plataforma de alertas, mapas ou histórico.

### Escopo do MVP

Incluído:

- Busca manual de cidades.
- Seleção explícita da cidade correta entre os resultados.
- Clima atual.
- Previsão diária de hoje mais quatro dias.
- Alternância entre Celsius e Fahrenheit.
- Interface em pt-BR e layout responsivo.
- Estados de carregamento, sucesso, vazio e erro.

Fora do MVP:

- Autenticação e contas de usuário.
- Persistência em servidor.
- Favoritos e histórico de cidades.
- Geolocalização automática.
- Previsão horária.
- Alertas, notificações, mapas, radar e imagens de satélite.
- Aplicação nativa para Android ou iOS.
- Suporte a múltiplos idiomas.

## Requisitos Funcionais

### Busca e seleção de cidade

- **RF01.** O sistema deve permitir informar o nome de uma cidade para
  pesquisa.
- **RF02.** O sistema deve consultar o serviço de geocodificação da Open-Meteo
  e apresentar resultados compatíveis.
- **RF03.** Cada resultado deve exibir cidade, região ou estado e país, quando
  disponíveis, para diferenciar localidades homônimas.
- **RF04.** O usuário deve selecionar explicitamente uma cidade. O sistema não
  deve selecionar automaticamente o primeiro resultado.
- **RF05.** A busca deve exigir pelo menos dois caracteres e preservar o texto
  informado quando não houver resultados ou ocorrer uma falha.
- **RF06.** O sistema deve informar quando nenhuma cidade for encontrada e
  permitir nova tentativa sem recarregar a página.

### Clima atual e previsão

- **RF07.** Após a seleção de uma cidade, o sistema deve consultar a Open-Meteo
  e exibir o clima atual da localidade selecionada.
- **RF08.** O clima atual deve exibir, no mínimo, temperatura, unidade,
  condição climática textual, representação visual da condição e horário da
  medição. A temperatura aparente poderá ser exibida quando disponível.
- **RF09.** O sistema deve exibir exatamente cinco datas de previsão: hoje e os
  quatro dias seguintes, em ordem cronológica.
- **RF10.** Para cada dia, o sistema deve exibir data, temperatura mínima,
  temperatura máxima e condição climática textual, com representação visual
  complementar.
- **RF11.** O dia atual deve ser identificado como “Hoje”. O cálculo de hoje
  deve respeitar o fuso horário da cidade consultada.
- **RF12.** Códigos meteorológicos da Open-Meteo devem ser convertidos pela
  aplicação para descrições em pt-BR. Códigos desconhecidos devem resultar em
  uma descrição genérica, sem exibir o código técnico ao usuário.
- **RF13.** O sistema deve exibir a data e o horário de referência dos dados,
  considerando o fuso horário retornado para a cidade.

### Unidades e preferências

- **RF14.** A unidade padrão deve ser Celsius (°C).
- **RF15.** O usuário deve poder alternar entre Celsius e Fahrenheit (°F).
- **RF16.** A alteração de unidade deve atualizar o clima atual e todos os
  valores da previsão de forma consistente.
- **RF17.** A unidade selecionada pode ser armazenada localmente no navegador,
  sem sincronização entre dispositivos e sem armazenamento em servidor.

### Estados e falhas

- **RF18.** O sistema deve exibir um estado inicial orientando o usuário a
  buscar uma cidade quando nenhuma localidade estiver selecionada.
- **RF19.** O sistema deve exibir um indicador de carregamento durante a busca
  de cidade e a consulta meteorológica.
- **RF20.** O sistema deve informar falhas de conexão, timeout, indisponibilidade
  da Open-Meteo e respostas inválidas ou incompletas.
- **RF21.** O sistema deve permitir uma nova tentativa manual sem perder o
  contexto da cidade selecionada, quando aplicável.
- **RF22.** O sistema não deve apresentar valores ausentes como se fossem dados
  válidos nem quebrar a interface diante de campos opcionais ausentes.

## Requisitos Não-Funcionais

### Usabilidade e responsividade

- **RNF01.** O fluxo principal deve permitir pesquisar uma cidade e visualizar
  sua previsão sem treinamento prévio.
- **RNF02.** O clima atual deve ter prioridade visual sobre informações
  complementares e a previsão deve ser facilmente escaneável.
- **RNF03.** A aplicação deve funcionar em smartphones, tablets e desktops, sem
  rolagem horizontal a partir de 320 px de largura.
- **RNF04.** A interface deve funcionar em orientações retrato e paisagem e
  manter controles utilizáveis em telas pequenas.
- **RNF05.** Mensagens de erro devem ser claras, estar em pt-BR e orientar o
  usuário sobre a ação possível.

### Acessibilidade

- **RNF06.** A aplicação deve seguir, no mínimo, os critérios aplicáveis da
  WCAG 2.2 nível AA.
- **RNF07.** Todos os fluxos principais devem ser navegáveis por teclado, com
  foco visível e ordem de navegação lógica.
- **RNF08.** Campos, botões, resultados, carregamento e erros devem utilizar
  nomes, papéis e estados semânticos adequados.
- **RNF09.** Condições meteorológicas não devem depender exclusivamente de cor
  ou ícone; devem possuir descrição textual.
- **RNF10.** Mudanças relevantes de estado devem ser comunicadas de modo
  compatível com tecnologias assistivas.
- **RNF11.** Controles interativos devem possuir área de toque adequada para
  dispositivos móveis.

### Desempenho e resiliência

- **RNF12.** A aplicação deve exibir feedback de carregamento imediatamente após
  o início de uma operação assíncrona.
- **RNF13.** A busca incremental deve utilizar debounce de aproximadamente 300
  ms ou mecanismo equivalente para reduzir requisições desnecessárias.
- **RNF14.** O sistema deve evitar chamadas duplicadas para a mesma consulta
  enquanto uma resposta válida estiver disponível durante a sessão.
- **RNF15.** Chamadas à Open-Meteo devem possuir timeout de 10 segundos e
  tratamento para falhas de rede e status HTTP não bem-sucedidos.
- **RNF16.** A indisponibilidade da fonte externa não deve travar ou quebrar a
  interface.
- **RNF17.** A integração deve validar e normalizar a resposta da Open-Meteo
  antes de entregá-la aos componentes de apresentação.

### Segurança e privacidade

- **RNF18.** A aplicação não deve expor chaves privadas ou credenciais no código
  enviado ao navegador. A Open-Meteo não exige API key para o escopo definido.
- **RNF19.** Entradas do usuário devem ser validadas, limitadas e tratadas antes
  de serem utilizadas em consultas ou renderizadas.
- **RNF20.** Comunicações com a Open-Meteo devem utilizar HTTPS.
- **RNF21.** Não devem ser coletados dados pessoais além dos necessários para a
  busca meteorológica.
- **RNF22.** Não haverá armazenamento de dados de usuário em servidor. Qualquer
  preferência local deve permanecer no dispositivo e não conter informação
  pessoal desnecessária.
- **RNF23.** Logs de erro não devem registrar dados pessoais ou localização além
  do necessário para diagnóstico.

### Compatibilidade, manutenção e qualidade

- **RNF24.** A aplicação deve ser validada nas versões atuais de Chrome, Firefox,
  Safari e Edge, incluindo navegadores móveis relevantes.
- **RNF25.** A integração com geocodificação e previsão deve permanecer isolada
  em uma camada de serviço substituível.
- **RNF26.** Regras de conversão, mapeamento de códigos meteorológicos e
  transformação de respostas devem ser testáveis independentemente da UI.
- **RNF27.** O projeto deve possuir testes automatizados para busca, seleção,
  previsão, troca de unidade e estados de erro, vazio e carregamento.
- **RNF28.** O processo de validação deve executar lint, build e testes antes da
  publicação.
- **RNF29.** Erros de integração, respostas inválidas e falhas inesperadas devem
  ser registrados de forma suficiente para diagnóstico, sem dados pessoais.

## Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Dados desatualizados ou interpretados como atuais | Média | Alto | Exibir horário e fuso da medição; definir validade para qualquer cache futuro; não ocultar dados antigos. |
| Indisponibilidade ou lentidão da Open-Meteo | Média | Alto | Timeout de 10 segundos, estado de erro, retry manual, monitoramento e possibilidade futura de cache. |
| Seleção de cidade homônima incorreta | Média | Alto | Exibir região e país; exigir seleção explícita; testar cidades homônimas. |
| Resposta incompleta ou mudança no contrato da API | Baixa/Média | Alto | Isolar integração, validar schema, normalizar dados e tratar campos ausentes. |
| Conversão de temperatura incorreta | Baixa | Alto | Centralizar a regra, definir arredondamento e cobrir Celsius/Fahrenheit com testes. |
| Data ou fuso horário incorreto | Média | Alto | Usar o timezone da cidade consultada; testar cidades em fusos diferentes; exibir a referência temporal. |
| Excesso de requisições ou uso abusivo do serviço | Média | Médio/Alto | Debounce, controle de chamadas duplicadas, limites de resultados e monitoramento de consumo. |
| Experiência inadequada em dispositivos móveis | Média | Alto | Abordagem mobile-first, testes em viewports representativos e verificação sem rolagem horizontal. |
| Falhas de acessibilidade | Média | Alto | Referência WCAG 2.2 AA, testes com teclado, leitor de tela e ferramentas automatizadas. |
| Entrada maliciosa ou conteúdo não confiável | Baixa/Média | Alto | Validar e limitar entradas, escapar conteúdo renderizado e aplicar boas práticas de segurança. |
| Dependência excessiva de um provedor externo | Baixa/Média | Alto | Manter contrato interno normalizado e camada de serviço substituível. |
| Decisão do usuário baseada exclusivamente na previsão | Média | Alto | Exibir fonte, horário e caráter informativo dos dados; não apresentar previsão como garantia. |
| Custos ou restrições futuras do provedor | Baixa/Média | Médio | Acompanhar termos e limites de uso; monitorar volume; manter a integração desacoplada. |

## Perguntas em Aberto (Open Questions)

As decisões abaixo não bloqueiam a definição do MVP quando tratadas como
recomendações, mas devem ser confirmadas antes do plano técnico definitivo.

### Bloqueiam ou podem alterar o escopo

1. A temperatura aparente fará parte do MVP ou será removida junto com os
   campos opcionais?
2. A aplicação deverá oferecer algum aviso relacionado a condições severas ou
   a previsão será estritamente informativa?
3. Qual matriz exata de navegadores e versões será oficialmente suportada?
4. Qual meta de tempo de resposta será usada para validar desempenho em rede
   móvel?
5. A preferência de unidade deve persistir após fechar e reabrir o navegador?

### Decisões técnicas para o plano

6. A aplicação fará chamadas diretamente do navegador ou utilizará proxy/backend?
   A recomendação atual é chamada direta no MVP, condicionada à confirmação de
   CORS e limites de uso da Open-Meteo.
7. Será necessário cache local de dados meteorológicos? A recomendação atual é
   não persistir previsão no MVP, mantendo apenas dados em memória durante a
   sessão.
8. Qual ferramenta será utilizada para monitoramento de erros em produção?
9. Quais níveis de cobertura de testes serão exigidos para a publicação?
10. Os critérios de acessibilidade serão validados apenas de forma automatizada
    ou também com testes manuais com tecnologia assistiva?

### Evolução posterior

11. A aplicação deverá incluir favoritos, histórico ou geolocalização automática?
12. Haverá necessidade de previsão horária, alertas ou notificações?
13. Haverá suporte a outros idiomas e localidades além de pt-BR?

## Suposições (Assumptions)

### Decisões confirmadas

- A fonte de dados será a Open-Meteo, sem API key.
- A previsão terá cinco datas: hoje mais os quatro dias seguintes.
- O fuso horário da cidade consultada determinará o significado de “hoje”.
- Celsius será a unidade padrão, com opção de alternância para Fahrenheit.
- A interface será apresentada em pt-BR.
- Não haverá autenticação.
- Não haverá persistência de dados em servidor.
- A aplicação será uma experiência web responsiva, não uma aplicação nativa.

### Suposições a validar

- A cobertura de geocodificação e previsão da Open-Meteo será suficiente para as
  cidades relevantes ao público inicial.
- A Open-Meteo permitirá as chamadas diretas necessárias a partir do navegador,
  incluindo CORS e volume compatível com o MVP.
- Os dados diários e códigos meteorológicos necessários estarão disponíveis no
  contrato escolhido da Open-Meteo.
- A unidade selecionada poderá ser armazenada localmente sem criar expectativa
  de conta ou sincronização entre dispositivos.
- Busca manual atende o MVP; geolocalização automática não é necessária para o
  primeiro lançamento.
- Os usuários aceitam uma previsão diária, sem necessidade de detalhamento
  horário.

### Regras de escopo

- Favoritos, histórico, alertas, notificações, mapas, radar, previsão horária e
  múltiplos idiomas não fazem parte da primeira versão.
- Sensação térmica, vento, umidade, precipitação, pressão e visibilidade são
  opcionais e só devem ser incluídos após decisão explícita de produto.
- Qualquer expansão do escopo deve ser avaliada contra impacto em desempenho,
  acessibilidade, consumo da API e prazo de entrega.
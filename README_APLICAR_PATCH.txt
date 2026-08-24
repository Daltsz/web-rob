LogicalEduc — Patch de feedback sem confirmação física do robô

Objetivo
- Ajustar apenas a mensagem de sucesso após POST /robots/:id/command.
- Não afirmar que o ESP8266 recebeu ou executou o comando.
- Não alterar backend, MQTT, banco, pareamento, seleção ou fluxo de envio.

Alteração
Antes:
  Codigo enviado para o robo

Depois:
  Código enviado com sucesso.

Motivo
A resposta de sucesso atual confirma que a API aceitou/processou a solicitação de envio, mas não existe ACK do ESP8266 confirmando recebimento ou execução física. A mensagem nova evita afirmar algo que o sistema ainda não consegue comprovar.

Arquivos
- src/Pages/FreeMode/index.js
- src/Pages/FreeMode/index.test.js

Validação realizada
- FreeMode: 6/6 testes
- Projeto completo: 9 suítes / 25 testes / 25 passando
- npm run build: concluído com warnings legados já existentes

Como aplicar
1. Extraia este ZIP na raiz do projeto web-rob.
2. Permita substituir os dois arquivos listados acima.
3. Rode:
   npm run test:ci
4. Depois valide manualmente com:
   npm start

Este patch deve ser aplicado depois do patch logicaleduc-robot-loading-states-v1-patch.zip, ou em um projeto que já contenha os estados loading/lista/vazio/erro/retry.

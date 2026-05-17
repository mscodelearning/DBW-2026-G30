# DBW-2026-G30-Skriven

# Projeto Matrioska de Palavras

# Link para o Protótipo
https://www.figma.com/design/V4CnCRUhqRlRt3aMpqBMty/Prototipo---DBW?node-id=0-1&p=f&t=uCUClVGZkR1T5unp-0

# Link para os Diagramas de Sequência 
https://app.diagrams.net/#G1lKmWgwfIUZr4TAZwQtRTPHAeSgalVQSE#%7B%22pageId%22%3A%22Dm8GCAjloSy8AhbAD12E%22%7D

# Configuração a ser feita para a execução do projeto
Após descarregar o projeto, abrir o terminal/consola e executar o comando 
    'node index.js'  +  enter 

De seguida abrir um browser e pesquisar o seguinte url
    'http://localhost:3000/'.
Esta ação abrirá a página web da aplicação desenvolvida e agora está tudo pronto para comecar a explorar a aplicação.


# Outras informações
O timer/tempo é contado em segundos durante os jogos.

Salas privadas: só o host/administrador pode começar o jogo.

Salas públicas: qualquer jogador pode comecar o jogo desde que a sala tenha no mínimo 2 users.

REGRAS DE JOGO:
A criação de palavras só pode ser feita da esquerda para a direita e de ordem de letras da palavra mestra de forma direta ou indireta.

TIPOS DE CHALLENGE:
Sem desafio de palavras;
Número mínimo de palavras a ser atingidas;
Criação de palavras de acordo com mínimo ou máximo de letras.

TIPOS DE CONTRA-RELÓGIO:
Sem contra-relógio;
Timers de 30 e 60 segundos;
Personalizado - onde o valor colocado/definido tem de ser em segundos.

É possível alterar o nickname e a palavra-passe.

O username é único pois é o que distingue os users registados.

É possível adicionar uma imagem ao avatar do jogador.

A data de expiração da sala pública é reiniciada sempre que é realizada uma ação na sala, como por exemplo a entrada de um user numa sala, alteração do nome da sala, enviar mensagem no chat.
Foi definido um tempo limite de 20 min e após esse tempo a sala pública é apagada da página das salas públicas. 

É possível visualizar a soma das estatísticas de todos os jogos na página do perfil.



# Aparte
Se for criada uma sala pública com um user num browser e noutro browser outro user2 for à pagina das salas públicas, se o nome foi alterado depois do user2 já lá estar, é necessário dar refresh na página para o novo nome aparecer.

Às vezes quando entramos na aplição web, ou até mesmo quando vamos para uma das páginas, pode acontecer descofiguração do css. Basta fazer refresh e ele volta ao normal.


# Referências

https://github.com/jfoclpf/words-pt
https://www.youtube.com/watch?v=CYlNJpltjMM
https://www.youtube.com/watch?v=5Fws9daTtIs
https://www.w3schools.com/bootstrap5/index.php: - site inicial generico introdutorio
https://www.w3schools.com/bootstrap5/bootstrap_alerts.php - popup salvar alteracoes
https://www.w3schools.com/bootstrap5/bootstrap_forms.php
https://www.youtube.com/watch?v=ybXulmeilFM
https://www.w3schools.com/bootstrap5/bootstrap_dropdowns.php
https://www.youtube.com/watch?v=fbYExfeFsI0&t=57s


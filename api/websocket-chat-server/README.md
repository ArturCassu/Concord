# WebSocket Chat Server

Este projeto é um servidor de chat baseado em WebSocket que permite a comunicação entre usuários em grupos de conversa, semelhante ao Discord. Os usuários podem se conectar, criar grupos e enviar mensagens para outros membros do grupo.

## Estrutura do Projeto

```
websocket-chat-server
├── src
│   ├── server.py          # Ponto de entrada da aplicação, configura o servidor WebSocket.
│   ├── groups
│   │   ├── __init__.py    # Inicializador do pacote de grupos.
│   │   └── group_manager.py # Gerencia grupos de conversa e comunicação entre usuários.
│   ├── users
│   │   ├── __init__.py    # Inicializador do pacote de usuários.
│   │   └── user_manager.py  # Gerencia usuários conectados e suas interações.
│   └── utils
│       └── __init__.py    # Inicializador do pacote de utilitários.
├── requirements.txt        # Dependências do projeto.
└── README.md               # Documentação do projeto.
```

## Instalação

Para instalar as dependências do projeto, execute o seguinte comando:

```
pip install -r requirements.txt
```

## Uso

Para iniciar o servidor, execute o arquivo `server.py`:

```
python src/server.py
```

Após iniciar o servidor, os usuários podem se conectar ao WebSocket e interagir entre si em grupos.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto é licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.
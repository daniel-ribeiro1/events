# Events

## Configurações do projeto 
  - #### 1º Instale as dependências 
    - `npm i` - instala os pacotes necessários para o funcionamento do projeto.
    
  - #### 2º Crie um banco de dados MySQL com as seguintes tabelas:
    ```
      # users   // Tabela de usuários 
        - id [ BIGINT UNSIGNED, Primary Key, Not Null, Auto Increment ]
        - name [ VARCHAR(255) ]
        - email [( VARCHAR(255) ]
        - password [ VARCHAR(255) ]
        
      # events // tabela de eventos
        - id [ BIGINT UNSIGNED, Primary Key, Not Null, Auto Increment ]
        - title [ VARCHAR(255) ]
        - startTime [ BIGINT UNSIGNED ]
        - endTime [ BIG INT UNSIGNED ]
        - description [ VARCHAR(240) ]
        - authorId [ BIGINT UNSIGNED, Foreign Key References to users table id ]
    ```
    
  - #### 3º Configure as variáveis de ambiente 
  ``` 
     # Server
      PORT=
      SECRET=""

      # DB
      MYSQL_DB=""
      MYSQL_USER=""
      MYSQL_PASSWORD=""
      MYSQL_PORT=
  ```
  
  - #### 4º Rode o projeto 
    - `npm run start-dev` - Inicia o servidor na porta que foi definida nas variáveis de ambiente.
  
 

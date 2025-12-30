# Backoffice - Gestão de Empresas e Usuários

Aplicação frontend em Vue 3 para gerenciamento de empresas e usuários, simulando um backoffice real. O projeto utiliza Composition API, Tailwind e um servidor fake em memória para CRUD de empresas e usuários.

## Stack

- Vue 3 + Composition API
- Vue Router
- Pinia
- TailwindCSS
- Axios (com adapter fake)
- Toasts e Tooltips
- TypeScript

## Funcionalidades

### Autenticação

- Login mockado
- Logout
- Redirecionamento para tela inicial após login

### Tela inicial

- Resumo de empresas ativas/inativas
- Total de usuários vinculados
- Atalhos para listagem e cadastro

### Listagem de empresas

- Dados exibidos: nome, CNPJ, status
- Acoes: visualizar, editar, excluir
- Busca por nome, CNPJ ou status
- Paginação (5 por página)
- Loading e tratamento de erro
- Ordenação alfabética
- Modal de confirmação para exclusão

### Cadastro/edição de empresa

- Campos obrigatórios: nome, CNPJ (com máscara e validação)
- Status (ativa/inativa)
- Logo da empresa (upload com preview)
- Validacoes visuais e mensagens de erro
- Feedback de sucesso e erro (toast)

### Detalhes da empresa

- Exibe dados da empresa e logo
- Lista usuários vinculados (nome, e-mail, cargo)
- Busca e paginação de usuários
- Acoes: editar/remover usuário com tooltip
- Modal para cadastro/edição de usuário
- Validação de e-mail único
- Feedback de sucesso e erro (toast)

### Telas
Login

<img width="676" height="293" alt="image" src="https://github.com/user-attachments/assets/87941f58-ecd7-43e9-9e81-4e59bacd9890" />
<img width="674" height="293" alt="image" src="https://github.com/user-attachments/assets/774b88aa-570b-4eed-b89b-7eea4cd73d72" />

Tela inicial


<img width="671" height="295" alt="image" src="https://github.com/user-attachments/assets/ed73f425-243e-4eaf-9d43-c4a2dbb16efb" />
<img width="666" height="295" alt="image" src="https://github.com/user-attachments/assets/386e2246-79c7-476f-a0be-3cdc7a2164b5" />

Listagem do de empresas


<img width="670" height="296" alt="image" src="https://github.com/user-attachments/assets/0c979a76-9006-48bc-94b8-011f070ce904" />
<img width="667" height="296" alt="image" src="https://github.com/user-attachments/assets/f32cc4ed-6469-465b-a245-ca748e26354b" />

Cadastro de empresas


<img width="676" height="296" alt="image" src="https://github.com/user-attachments/assets/ac9919ad-5a73-4624-abf5-cb8efa1f9bfe" />
<img width="676" height="292" alt="image" src="https://github.com/user-attachments/assets/2eef0156-20e2-4973-aeec-364ccfb05ee6" />

Detalhes de empresa


<img width="667" height="296" alt="image" src="https://github.com/user-attachments/assets/d9c69df9-9248-4ccb-9707-6e75782283c4" />
<img width="665" height="293" alt="image" src="https://github.com/user-attachments/assets/a9407b53-c0a8-483f-9d10-9c326c83b298" />

Adicionar usuários


<img width="670" height="296" alt="image" src="https://github.com/user-attachments/assets/bf4eb006-dc81-4092-a53b-a1e139da4e22" />
<img width="669" height="296" alt="image" src="https://github.com/user-attachments/assets/6d10feb7-3c7b-4ac1-8a39-3eb5708369af" />



## Instalação

```bash
npm install --legacy-peer-deps
```

## Scripts

```bash
npm run serve
npm run build
npm run lint
npm run type-check
```

## Observação

- API fake roda localmente em memória (sem backend real).
- O login aceita senha mock: `admin`.
- Para checagem de tipos, recomenda-se Node 20 LTS (Node 22 pode causar erro no vue-tsc).

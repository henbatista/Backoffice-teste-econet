# Backoffice - Gestão de Empresas e Usuários

Aplicação frontend em Vue 3 para gerenciamento de empresas e usuários, simulando um backoffice real. O projeto utiliza Composition API, Tailwind e um servidor fake em memória para CRUD de empresas e usuários.

## Stack

- Vue 3 + Composition API
- Vue Router
- Pinia
- TailwindCSS
- Axios (com adapter fake)
- Toasts e Tooltips
- TypeScript (migracao completa)

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

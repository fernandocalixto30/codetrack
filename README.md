# Code Track

[![Deploy](https://img.shields.io/badge/Ver%20o%20Projeto-Online-blue)](https://code-track-jtm6.vercel.app/)

## Sobre o Projeto

**Code Track** é um sistema de cadastro de clientes desenvolvido para desenvolvedores freelancers que desejam organizar e gerenciar seus clientes de forma eficiente. A aplicação permite o registro de informações essenciais dos clientes, como nome, contato, projetos em andamento e status de pagamento.

### Tecnologias Utilizadas
- **React**: Para a construção da interface do usuário.
- **Vite**: Para um build rápido e otimizado.
- **React Icons**: Para a utilização de ícones.
- **Tailwind CSS**: Para um design moderno e responsivo.
- **Vercel**: Para o deploy da aplicação.
- **Firebase**: Para armazenamento de dados e autenticação de usuários.

## Módulo Projetos & Financeiro
1. No Supabase, abra **SQL Editor** e execute o arquivo `supabase-schema.sql`.
2. Confirme que a tabela `clientes` existente tem `id`, `nome` e `user_id` (o `cliente_id` de projetos armazena o ID como texto para acomodar o tipo de ID já usado).
3. Rode `npm install` e `npm run dev`.
4. Faça login, cadastre clientes e acesse **Projetos & Financeiro** pelo menu.

O módulo permite cadastrar/editar/excluir projetos, acompanhar status e entrega, gerar parcelas pendentes automaticamente, marcar parcelas como pagas, registrar recebimentos avulsos e visualizar contratado/recebido/a receber/vencido. As operações dependem das tabelas e políticas RLS criadas pelo SQL.

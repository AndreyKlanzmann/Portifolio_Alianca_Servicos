# 🖥️ PDV Demo — Sistema de Gestão (Portfólio)

Sistema web completo de gestão interna para ponto de venda de serviços (lan house, papelaria e similares).
Construído do zero como projeto de portfólio.

> 💡 **Modo demonstração** — esta versão simula o Firebase em memória (os dados resetam ao recarregar a página) e não contém nenhuma informação real de clientes, funcionários ou de qualquer empresa.

## ✨ Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| 📋 Central de Serviços | 85+ serviços documentados com passo a passo e links diretos |
| 🛒 Caixa & Carrinho | Registro de atendimentos, modo rápido, histórico e comprovante |
| 📦 Estoque | Cadastro de produtos, importação em lote (SMB) e baixa automática |
| 👥 Clientes | Cadastro de clientes, serviços pendentes, status de pagamento/entrega |
| 📊 Dashboard | Gráficos de faturamento, relatórios CSV e envio via Telegram |
| 💸 Despesas | Registro de saídas manuais e do estoque, protegido por senha admin |
| 🔒 Fechamento de Caixa | Moeda, recolhido, cupom de impressão 1/8 A4 e resumo no Telegram |
| 🔐 Controle de Acesso | Senha de entrada + senha admin com hash SHA-256 |
| 🌙 Dark Mode | Tema claro/escuro persistente |

## 🛠️ Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript puro (sem frameworks)
- **Banco de dados:** simulado em memória nesta demo (a versão completa usa Firebase Firestore em tempo real, multi-PC)
- **Hospedagem:** GitHub Pages
- **Notificações:** Telegram Bot API (token/chat ID configuráveis pelo próprio usuário, opcional)
- **Gráficos:** Chart.js

## 📁 Estrutura do projeto

```
pdv-demo/
├── index.html              # Estrutura HTML principal
├── css/
│   ├── variables.css       # Design tokens (cores, espaços, tipografia)
│   ├── layout.css          # Header, main, grid de seções
│   ├── components.css      # Botões, cards, modais, carrinho
│   ├── dashboard.css       # Módulo de dashboard e gráficos
│   └── admin.css           # Módulo de acesso administrativo
├── js/
│   ├── firebase.js         # Mock em memória (simula Firestore para a demo)
│   ├── data.js             # Catálogo de serviços e lookups
│   ├── ui.js                # Render de cards, busca, modais
│   ├── cart.js              # Carrinho, modo rápido, total do dia
│   ├── relatorios.js        # Histórico, CSV, comprovante, gráfico
│   ├── dashboard.js         # Dashboard, Telegram, fechamento de caixa
│   ├── estoque.js           # Estoque, loja, importação SMB
│   ├── clientes.js          # Cadastro e acompanhamento de clientes
│   ├── despesas.js          # Módulo de despesas do dia
│   ├── acesso.js            # Tela de senha de entrada
│   └── admin.js             # Controle de acesso admin (SHA-256)
└── imagens/                 # Screenshots de passo a passo dos serviços
```

## ⚙️ Sobre esta demo

- **Senha de entrada:** `demo123` (exibida na própria tela de login, de propósito)
- **Senha admin:** `admin123` (desbloqueia Histórico/Total/PDF protegidos)
- Os dados de atendimentos, despesas e clientes são fictícios e existem apenas na memória do navegador — ao recarregar a página, tudo volta ao estado inicial de demonstração.
- O módulo de Telegram pode ser configurado livremente com um token/chat ID de teste; nenhuma credencial real está embutida no código.
- Para usar com persistência real entre dispositivos, `js/firebase.js` precisaria ser reescrito para apontar para um projeto Firebase próprio (fora do escopo desta demo).

## 📸 Preview

> Projeto de portfólio inspirado em um sistema real usado por uma lan house e papelaria — adaptado aqui sem nenhum dado real de clientes, funcionários ou da empresa original.

- Modo escuro ativo por padrão
- Responsivo para tablet e desktop

## 👨‍💻 Sobre o projeto

Desenvolvido por **Andrey Klanzmann**, estudante de Análise e Desenvolvimento de Sistemas.

- Projeto de portfólio baseado em um sistema real desenvolvido por iniciativa própria
- Evolução contínua com novas funcionalidades

---

*Feito com HTML/CSS/JS puro. Sem frameworks, sem dependências complexas.*

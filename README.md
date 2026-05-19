# 🖥️ Aliança Serviços — Sistema Interno de Gestão

Sistema web completo de gestão interna desenvolvido para uma lan house e papelaria em Juiz de Fora, MG.  
Construído do zero como projeto de portfólio e adotado pela empresa como sistema oficial.

## ✨ Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| 📋 Central de Serviços | 85+ serviços documentados com passo a passo e links diretos |
| 🛒 Caixa & Carrinho | Registro de atendimentos, modo rápido, histórico e comprovante |
| 📦 Estoque | Cadastro de produtos, importação em lote (SMB) e baixa automática |
| 📊 Dashboard | Gráficos de faturamento, relatórios CSV e envio via Telegram |
| 💸 Despesas | Registro de saídas manuais e do estoque, protegido por senha admin |
| 🔒 Fechamento de Caixa | Moeda, recolhido, cupom de impressão 1/8 A4 e resumo no Telegram |
| 🔐 Controle de Acesso | Senha de entrada + senha admin com hash SHA-256 |
| 🌙 Dark Mode | Tema claro/escuro persistente |

## 🛠️ Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript puro (sem frameworks)
- **Banco de dados:** Firebase Firestore (tempo real, multi-PC)
- **Hospedagem:** GitHub Pages
- **Notificações:** Telegram Bot API
- **Gráficos:** Chart.js

## 📁 Estrutura do projeto

```
alianca-servicos/
├── index.html              # Estrutura HTML principal
├── css/
│   ├── variables.css       # Design tokens (cores, espaços, tipografia)
│   ├── layout.css          # Header, main, grid de seções
│   ├── components.css      # Botões, cards, modais, carrinho
│   ├── dashboard.css       # Módulo de dashboard e gráficos
│   └── admin.css           # Módulo de acesso administrativo
├── js/
│   ├── firebase.js         # Inicialização e funções do Firestore
│   ├── data.js             # Catálogo de serviços e lookups
│   ├── ui.js               # Render de cards, busca, modais
│   ├── cart.js             # Carrinho, modo rápido, total do dia
│   ├── relatorios.js       # Histórico, CSV, comprovante, gráfico
│   ├── dashboard.js        # Dashboard, Telegram, fechamento de caixa
│   ├── estoque.js          # Estoque, loja, importação SMB
│   ├── despesas.js         # Módulo de despesas do dia
│   ├── acesso.js           # Tela de senha de entrada
│   └── admin.js            # Controle de acesso admin (SHA-256)
└── imagens/                # Screenshots de passo a passo dos serviços
```

## ⚙️ Como configurar

### 1. Firebase

1. Crie um projeto em [firebase.google.com](https://firebase.google.com)
2. Ative o **Firestore Database**
3. Edite `js/firebase.js` com suas credenciais:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.firebasestorage.app",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:000000000000"
};
```

4. Crie os índices no Firestore (o sistema vai indicar os links na primeira vez que usar)

### 2. Senhas

**Senha de entrada** — edite `js/acesso.js`:
```javascript
var SENHA = 'suasenha';
```

**Senha admin** — gere o hash SHA-256 da sua senha em [emn178.github.io/online-tools/sha256.html](https://emn178.github.io/online-tools/sha256.html) e cole em `js/admin.js`:
```javascript
const ADMIN_HASH = 'seu_hash_sha256_aqui';
```

### 3. Deploy no GitHub Pages

1. Suba os arquivos em um repositório público
2. Vá em **Settings → Pages → Deploy from branch → main**
3. Acesse via `https://seu-usuario.github.io/alianca-servicos`

### 4. Telegram (opcional)

1. Crie um bot com [@BotFather](https://t.me/BotFather) no Telegram
2. No dashboard do sistema (ícone ⚙️), configure o token e chat ID
3. O sistema enviará relatórios diários, semanais e mensais automaticamente

## 📸 Preview

> Sistema em uso real na Aliança Informática — Juiz de Fora, MG.

- Modo escuro ativo por padrão
- Responsivo para tablet e desktop
- Sincronização em tempo real entre múltiplos computadores

## 👨‍💻 Sobre o projeto

Desenvolvido por **Andrey Klanzmann**, estudante de Análise e Desenvolvimento de Sistemas.

- Iniciativa própria, sem solicitação da empresa
- Adotado como sistema oficial após apresentação
- Evolução contínua com novas funcionalidades

---

*Feito com HTML/CSS/JS puro + Firebase. Sem frameworks, sem dependências complexas.*

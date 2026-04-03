# 🔥 Roleta do Prazer 🔥

> **Jogo erótico de roleta para casais adultos** 🔞

## ✨ Funcionalidades

- 🎰 **Roleta animada** com giro realista e desaceleração suave
- 👫 **Turnos alternados** — ele gira, depois ela gira
- 💋 **Modo Preliminares** — 15 atividades de sexo oral e preliminares
- 🔥 **Modo Posições** — 16 posições com descrição detalhada
- 📋 **Card de resultado** com nome da posição, descrição completa e instrução
- 🔄 **Troca de modo** a qualquer momento — do esquentamento direto para as posições
- 🎨 **Design dark e sensual** com gradientes e animações

---

## 📱 Como instalar no Android (APK)

### Opção 1 — GitHub Actions (Recomendado)

1. **Crie uma conta no Expo:** https://expo.dev/signup
2. **Obtenha o EXPO_TOKEN:**
   - Vá em https://expo.dev/accounts/[seu-usuario]/settings/access-tokens
   - Clique em "Create token"
   - Copie o token

3. **Configure o GitHub Secret:**
   - No seu repositório GitHub, vá em Settings > Secrets and variables > Actions
   - Clique em "New repository secret"
   - Nome: `EXPO_TOKEN`
   - Valor: cole o token do Expo

4. **Atualize o `app.json`:**
   - Execute `eas init` localmente para obter seu `projectId`
   - Ou crie o projeto em https://expo.dev e copie o ID

5. **Faça push para o branch main:**
   ```bash
   git add .
   git commit -m "🔥 Roleta do Prazer"
   git push origin main
   ```

6. **Acompanhe o build:**
   - Vá em Actions no GitHub
   - O APK será gerado em ~10 minutos
   - Baixe em expo.dev > seu projeto > Builds

---

### Opção 2 — Build local

```bash
# 1. Instale as dependências
npm install

# 2. Instale o EAS CLI
npm install -g eas-cli

# 3. Faça login no Expo
eas login

# 4. Inicialize o projeto EAS
eas init

# 5. Build APK
eas build --platform android --profile preview
```

---

### Opção 3 — Teste imediato com Expo Go

```bash
npm install
npx expo start
```

Escaneie o QR code com o app **Expo Go** (disponível na Play Store).

---

## 📂 Estrutura do Projeto

```
roleta-erotica/
├── App.js                          # Ponto de entrada + navegação
├── app.json                        # Config do Expo
├── eas.json                        # Config do build EAS
├── package.json                    # Dependências
├── babel.config.js
├── .github/
│   └── workflows/
│       └── build-apk.yml          # CI/CD GitHub Actions
└── src/
    ├── data/
    │   └── gameData.js            # Todas as posições e preliminares
    ├── screens/
    │   ├── HomeScreen.js          # Tela inicial (nomes)
    │   └── GameScreen.js          # Tela do jogo com roleta
    └── components/
        ├── RouletteWheel.js       # Componente da roleta SVG
        └── ResultCard.js          # Card de resultado
```

---

## 🎮 Como Jogar

1. **Tela Inicial:** Digite o nome do homem e da mulher
2. **Jogo:** A roleta aparece com o nome de quem deve girar
3. **Gire:** Toque no botão para girar a roleta
4. **Resultado:** Veja o que vocês devem fazer com descrição completa
5. **Continue:** O próximo a girar aparece automaticamente
6. **Mude de fase:** Toque no ícone de troca para ir para as posições ou voltar

---

## 🛠️ Tecnologias

- **React Native** + **Expo SDK 51**
- **EAS Build** para geração do APK
- **React Navigation** para navegação entre telas
- **React Native SVG** para a roleta animada
- **Expo Linear Gradient** para os gradientes

---

## 🔞 Aviso

**Este aplicativo é exclusivamente para adultos maiores de 18 anos.**  
Desenvolvido para uso privado entre casais.

---

*Feito com ❤️ e muito 🔥*

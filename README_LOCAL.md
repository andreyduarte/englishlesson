# LinguaGen AI - Local App

Este projeto foi transformado em um aplicativo local utilizando Electron, React e Vite.

## Pré-requisitos

*   Node.js instalado.
*   Chave de API do Google Gemini.

## Como Rodar Localmente (Desenvolvimento)

Para iniciar o aplicativo em modo de desenvolvimento (com Hot Reload):

```bash
npm run electron:dev
```

Isso abrirá uma janela do aplicativo desktop.

## Como Gerar o Executável (.exe)

Para criar o instalador do Windows:

```bash
npm run electron:build
```

**Nota Importante:** Se você encontrar erros de permissão (como "A required privilege is not held by the client") durante o build, tente rodar o terminal **como Administrador** ou ative o "Modo de Desenvolvedor" nas configurações do Windows. Isso é necessário porque o processo de build cria links simbólicos.

O executável será gerado na pasta `dist_electron`.

## Configuração da API Key

1.  Abra o aplicativo.
2.  Vá para a aba **Settings**.
3.  Insira sua chave API do Gemini na seção de configuração.
4.  A chave será salva localmente no seu computador.

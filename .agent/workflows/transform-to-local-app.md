---
description: Plano para transformar em aplicativo local com persistência e API configurável
---

# Plano de Transformação: Aplicativo Local com Persistência e Chave API Configurável

## Análise do Estado Atual

### Arquitetura Atual
- **Framework**: React 19 + Vite + TypeScript
- **Roteamento**: React Router DOM (HashRouter)
- **Persistência**: LocalStorage (navegador)
- **API**: Google Gemini AI (chave hardcoded via variável de ambiente)
- **Estilo**: TailwindCSS (CDN)
- **Deployment**: Aplicação web (importmap com CDN)

### Funcionalidades Existentes
1. ✅ Gerenciamento de estudantes (CRUD)
2. ✅ Geração de aulas personalizadas com IA
3. ✅ Visualização e edição de aulas
4. ✅ Backup/Restore de dados (JSON)
5. ✅ Persistência local via LocalStorage
6. ⚠️ Chave API parcialmente configurável (já iniciado)

### Problemas Identificados
1. ❌ Chave API ainda referenciada via `process.env.API_KEY` no código
2. ❌ Aplicação depende de CDN (não funciona offline)
3. ❌ Não é um aplicativo desktop/local verdadeiro
4. ❌ Dados limitados ao LocalStorage (5-10MB)

---

## Plano de Implementação

### **FASE 1: Migração da Chave API para LocalStorage** ✅ (Parcialmente Concluído)

#### 1.1. Atualizar storageService.ts ✅
- [x] Adicionar métodos `saveApiKey()` e `loadApiKey()`
- [x] Armazenar chave em `localStorage.getItem('linguaGenApiKey')`

#### 1.2. Atualizar Settings.tsx ✅
- [x] Adicionar campo de input para API Key
- [x] Implementar toggle show/hide para segurança
- [x] Salvar chave ao clicar em "Save Key"
- [x] Carregar chave salva ao montar componente

#### 1.3. Atualizar geminiService.ts ⏳ (PRÓXIMO PASSO)
- [ ] Remover dependência de `process.env.API_KEY`
- [ ] Importar `storageService.loadApiKey()`
- [ ] Modificar funções `generateLesson()` e `refineLesson()`:
  ```typescript
  const apiKey = storageService.loadApiKey();
  if (!apiKey) {
    throw new Error("API Key not configured. Please set it in Settings.");
  }
  const ai = new GoogleGenAI({ apiKey });
  ```

#### 1.4. Atualizar CreateLesson.tsx ⏳
- [ ] Adicionar tratamento de erro específico para API Key ausente
- [ ] Exibir mensagem amigável direcionando para Settings
- [ ] Adicionar link direto para `/settings` no erro

#### 1.5. Remover configuração de ambiente ⏳
- [ ] Remover `define` do `vite.config.ts` (linhas 13-16)
- [ ] Atualizar README para remover instruções de `.env`

---

### **FASE 2: Converter para Aplicativo Desktop com Electron** (OPCIONAL)

#### 2.1. Instalar Electron
```bash
npm install --save-dev electron electron-builder
npm install --save-dev concurrently wait-on
```

#### 2.2. Criar estrutura Electron
- [ ] Criar `electron/main.js` (processo principal)
- [ ] Criar `electron/preload.js` (ponte segura)
- [ ] Configurar IPC para comunicação

#### 2.3. Atualizar package.json
```json
{
  "main": "electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "electron:dev": "concurrently \"vite\" \"wait-on http://localhost:3000 && electron .\"",
    "electron:build": "vite build && electron-builder"
  },
  "build": {
    "appId": "com.linguagen.ai",
    "productName": "LinguaGen AI",
    "files": ["dist/**/*", "electron/**/*"],
    "directories": {
      "output": "release"
    },
    "win": {
      "target": "nsis",
      "icon": "build/icon.ico"
    }
  }
}
```

#### 2.4. Migrar de LocalStorage para Electron Store
- [ ] Instalar `electron-store`
- [ ] Criar `services/electronStorageService.ts`
- [ ] Migrar dados do localStorage para arquivo local
- [ ] Suportar backup automático

---

### **FASE 3: Otimização para Uso Offline**

#### 3.1. Remover dependências de CDN
- [ ] Instalar TailwindCSS localmente:
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- [ ] Criar `tailwind.config.js`
- [ ] Criar `src/index.css` com diretivas Tailwind
- [ ] Remover `<script src="https://cdn.tailwindcss.com">` do HTML

#### 3.2. Remover importmap (já usando bundler)
- [ ] Remover bloco `<script type="importmap">` do `index.html`
- [ ] Vite já gerencia as importações via bundling

#### 3.3. Adicionar Service Worker (PWA - opcional)
- [ ] Instalar `vite-plugin-pwa`
- [ ] Configurar cache de assets
- [ ] Permitir uso offline completo

---

### **FASE 4: Melhorias de Persistência**

#### 4.1. Implementar sistema de arquivo local (Electron)
- [ ] Usar File System Access API (navegador moderno)
- [ ] Ou usar `fs` do Node.js (Electron)
- [ ] Permitir escolher pasta de dados
- [ ] Auto-save a cada mudança

#### 4.2. Adicionar versionamento de dados
- [ ] Implementar migrations para schema changes
- [ ] Backup automático antes de updates
- [ ] Histórico de versões

#### 4.3. Exportar/Importar melhorado
- [ ] Adicionar opção de exportar para PDF
- [ ] Exportar aulas individuais
- [ ] Importar de múltiplos formatos

---

### **FASE 5: Segurança e Validação**

#### 5.1. Validar API Key
- [ ] Adicionar botão "Test Connection" em Settings
- [ ] Fazer chamada de teste ao Gemini
- [ ] Exibir status da conexão

#### 5.2. Criptografar dados sensíveis (opcional)
- [ ] Criptografar API Key no storage
- [ ] Opção de senha mestra para dados

#### 5.3. Tratamento de erros robusto
- [ ] Retry logic para chamadas API
- [ ] Fallback para modo offline
- [ ] Logs de erro detalhados

---

## Ordem de Execução Recomendada

### **Implementação Mínima (Web App Local)**
1. ✅ Fase 1.1-1.2: Storage e UI da API Key
2. ⏳ Fase 1.3-1.5: Migrar lógica de API Key
3. ⏳ Fase 3.1: TailwindCSS local
4. ⏳ Fase 5.1: Validação de API Key

**Resultado**: Aplicativo web totalmente funcional offline (após build), com API configurável via UI.

### **Implementação Completa (Desktop App)**
5. Fase 2: Electron (aplicativo desktop nativo)
6. Fase 4: Persistência avançada
7. Fase 5.2-5.3: Segurança adicional

---

## Comandos Úteis

### Desenvolvimento Web
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
```

### Desenvolvimento Electron (após Fase 2)
```bash
npm run electron:dev    # Dev com hot reload
npm run electron:build  # Build executável
```

### Instalação de Dependências
```bash
# Fase 1 (já instalado)
# Nenhuma dependência adicional necessária

# Fase 2 (Electron)
npm install --save-dev electron electron-builder concurrently wait-on
npm install electron-store

# Fase 3 (Tailwind local)
npm install -D tailwindcss postcss autoprefixer

# Fase 3 (PWA - opcional)
npm install -D vite-plugin-pwa
```

---

## Próximos Passos Imediatos

1. **Atualizar `geminiService.ts`** para usar `storageService.loadApiKey()`
2. **Atualizar `CreateLesson.tsx`** para tratar erro de API Key ausente
3. **Remover configuração de ambiente** do `vite.config.ts`
4. **Testar fluxo completo**: Settings → Salvar Key → Criar Aula
5. **Instalar TailwindCSS localmente** para remover dependência de CDN

---

## Notas Importantes

- ⚠️ **Backup**: Sempre fazer backup dos dados antes de mudanças estruturais
- 🔒 **Segurança**: API Keys são sensíveis - considerar criptografia
- 📦 **Build Size**: Electron aumenta significativamente o tamanho do app
- 🌐 **Alternativa**: PWA pode ser suficiente sem Electron
- 💾 **LocalStorage**: Limite de ~10MB - suficiente para centenas de aulas

---

## Decisões Arquiteturais

### Web App vs Desktop App

**Web App (Recomendado para início)**
- ✅ Mais simples de manter
- ✅ Funciona em qualquer SO
- ✅ Atualização automática
- ✅ Menor tamanho
- ❌ Limitado ao navegador
- ❌ LocalStorage limitado

**Desktop App (Electron)**
- ✅ Experiência nativa
- ✅ Acesso completo ao sistema de arquivos
- ✅ Sem limites de storage
- ✅ Pode rodar sem navegador
- ❌ Maior complexidade
- ❌ Build size grande (~100MB+)
- ❌ Manutenção de múltiplas plataformas

### Recomendação Final

**Começar com Web App otimizado** (Fases 1 e 3), depois avaliar necessidade de Electron baseado no feedback de uso.

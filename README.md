# Nosso caderno de receitas 🍳

Site para guardar receitas em vídeo (YouTube e Instagram), organizadas por tipo. Só os dois e-mails cadastrados conseguem entrar, ver e adicionar receitas.

Tecnologias: Next.js, Firebase (login Google + banco Firestore) e Vercel. Tudo no plano gratuito.

---

## 1. Firebase (uns 5 minutos)

1. Acesse https://console.firebase.google.com e clique em **Adicionar projeto**. Dê um nome (ex.: `caderno-receitas`). Pode desativar o Google Analytics.
2. **Login**: menu *Build → Authentication → Começar*. Em *Método de login*, ative **Google** e salve.
3. **Banco**: menu *Build → Firestore Database → Criar banco de dados*. Escolha a região `southamerica-east1 (São Paulo)` e o **modo de produção**.
4. **Regras de segurança**: ainda no Firestore, abra a aba **Regras**, apague tudo e cole o conteúdo do arquivo `firestore.rules` deste projeto. **Troque os dois e-mails** pelos de vocês e clique em **Publicar**. É essa regra que garante que só vocês dois acessam os dados.
5. **Chaves do app**: clique na engrenagem ⚙️ → *Configurações do projeto* → em *Seus apps*, clique no ícone **</>** (Web), dê um nome e registre. Vai aparecer um bloco `firebaseConfig`. Guarde os valores de `apiKey`, `authDomain`, `projectId` e `appId`.

## 2. GitHub

1. Crie um repositório novo (pode ser **privado**) em https://github.com/new.
2. Envie os arquivos deste projeto. O jeito mais fácil sem terminal: na página do repositório vazio, clique em **uploading an existing file** e arraste todos os arquivos e pastas (menos `node_modules`, se existir).

Pelo terminal:
```bash
git init
git add .
git commit -m "Primeira versão"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main
```

## 3. Vercel

1. Em https://vercel.com, entre com o GitHub e clique em **Add New → Project**. Importe o repositório.
2. Antes de clicar em Deploy, abra **Environment Variables** e cadastre:

| Nome | Valor |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | apiKey |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | authDomain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | projectId |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | appId |
| `NEXT_PUBLIC_ALLOWED_EMAILS` | `voce@gmail.com,namorada@gmail.com` |

3. Clique em **Deploy**. Em cerca de 1 minuto o site estará num endereço tipo `caderno-receitas.vercel.app`.

## 4. Último passo: autorizar o domínio no Firebase

No Firebase, vá em *Authentication → Configurações → Domínios autorizados* e adicione o endereço da Vercel (ex.: `caderno-receitas.vercel.app`, sem `https://`). Sem isso, o botão "Entrar com Google" dá erro.

Pronto! Os dois entram com Google e as receitas aparecem na hora para ambos.

---

## Como usar

- **+ Nova receita** → cole o link. Para YouTube, o título é preenchido sozinho. Escolha o tipo, e se quiser anote ingredientes e observações.
- As abas no topo filtram por tipo; a busca procura em nomes, ingredientes e anotações.
- O coração marca favoritas, que têm aba própria.
- Clique num card para ver o vídeo dentro do site, editar ou apagar.
- Dica: no celular, abra o site no navegador e use "Adicionar à tela de início" para ele virar um app.

## Personalizar

- **Categorias**: edite `lib/categories.js` (nome, emoji e cor de cada uma).
- **Cores e fontes**: `app/globals.css` e `app/layout.js`.
- **Adicionar mais pessoas**: inclua o e-mail na variável `NEXT_PUBLIC_ALLOWED_EMAILS` (Vercel → Settings → Environment Variables, depois *Redeploy*) **e** em `firestore.rules` no Firebase.

## Rodar no computador (opcional)

```bash
cp .env.example .env.local   # preencha os valores
npm install
npm run dev                  # abre em http://localhost:3000
```
Adicione também `localhost` nos domínios autorizados do Firebase (normalmente já vem).

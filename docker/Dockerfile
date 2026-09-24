FROM node:24-slim

# ホストと共有する src/.nuxt などが root 所有にならないよう、node ユーザー(UID 1000)で動かす
WORKDIR /app
RUN chown node:node /app
USER node

# 依存関係のインストールをソースの変更と分けてキャッシュする
COPY --chown=node:node ./src/package.json ./src/package-lock.json /app/
RUN npm ci

COPY --chown=node:node ./src/ /app/

CMD ["npm", "run", "dev"]

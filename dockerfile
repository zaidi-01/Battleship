FROM node:21

WORKDIR /app

COPY --chown=node:node . /app/

RUN npm install --prefix ./client
RUN npm install --prefix ./server

ENV PORT 3000
ENV NODE_ENV production

RUN npm run build --prefix ./server

HEALTHCHECK --interval=1m --timeout=10s --retries=3 CMD wget -q -O - http://localhost:3000 || exit 1

USER node

EXPOSE 3000

CMD ["node", "./server/dist/server.js"]

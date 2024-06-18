# BUILD FOR LOCAL DEVELOPMENT
FROM node:20.14 as development

USER node:node
WORKDIR /app

COPY --chown=node:node package.json ./

RUN npm install

COPY --chown=node:node . .

RUN npm run build

RUN chmod +x dev-entrypoint.sh

EXPOSE $PORT

# PRODUCTION
FROM node:20.14 as production

ENV NODE_ENV PROD

USER node:node
WORKDIR /app

COPY --chown=node:node --from=development /app/package.json /app/tsconfig.json ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node --from=development /app/src ./src
COPY --chown=node:node --from=development /app/dist ./dist
COPY --chown=node:node --from=development /app/prod-entrypoint.sh ./prod-entrypoint.sh

RUN chmod +x prod-entrypoint.sh

CMD [ "npm", "run", "start:prod" ]

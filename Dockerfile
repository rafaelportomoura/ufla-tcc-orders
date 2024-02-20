FROM node:20-alpine3.18

ADD ["./package.json", "/package.json"]

RUN yarn install --ignore-engines --production=true
RUN find ./node_modules -mtime +10950 -exec touch {} +

ADD ["./dist", "/dist"]
RUN chmod 777 /dist
RUN chmod 777 /dist/*
RUN chmod 777 /package.json

RUN ls

CMD [ "node", "/dist/handlers/server.js" ]

FROM node:20-alpine3.18

ADD ["./package.json", "package.json"]
RUN chmod 777 package.json
ADD ["./tsconfig.json", "tsconfig.json"]
RUN sed -i '/"prepare": "husky install",/d' package.json
RUN npm install -g pnpm --loglevel=error
RUN pnpm install --prod --loglevel=error
RUN find ./node_modules -mtime +10950 -exec touch {} +

ADD ["./dist", "dist"]
RUN chmod 777 dist
RUN chmod 777 dist/*

CMD [ "node", "dist/handlers/server.js" ]
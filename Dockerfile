# base
FROM node:16-alpine AS base
RUN apk add curl

WORKDIR /usr/src/app
COPY package*.json ./

# install dependencies dev and prod 
FROM base AS dependencies
RUN npm i --only=production 
RUN cp -R node_modules prod_node_modules
RUN npm ci
RUN npm install typescript -g

# test and build typescript 
FROM dependencies AS test-and-build
COPY . .
# RUN npm run eslint
# RUN npm test
RUN npm run build
RUN cp -R dist dist_run

# run 
FROM base AS release
COPY --from=dependencies /usr/src/app/prod_node_modules ./node_modules
COPY --from=test-and-build /usr/src/app/dist_run ./

CMD ["node", "index.js"]

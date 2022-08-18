FROM node:alpine
WORKDIR /blockChain
COPY package.json .
RUN npm install
COPY . .
EXPOSE 9000
CMD ["node", "main.js"]

FROM node

WORKDIR /src

COPY package* ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm","run","dev"]
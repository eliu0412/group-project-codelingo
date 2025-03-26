FROM node:23


WORKDIR /app


COPY package*.json ./

RUN npm install


COPY . .


EXPOSE 8085


CMD ["npm", "run"]
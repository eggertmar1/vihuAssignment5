FROM node:16-alpine
LABEL author = "Eggert Mar EGgertsson eggerte19@ru.is"

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm run prisma:init
CMD ["npm", "run", "start"]
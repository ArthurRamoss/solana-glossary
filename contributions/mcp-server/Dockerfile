FROM node:22-slim
WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY dist ./dist
COPY data ./data

EXPOSE 3000
CMD ["node", "dist/index.js"]

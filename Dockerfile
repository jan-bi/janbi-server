FROM mcr.microsoft.com/playwright:v1.52.0-jammy
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npx playwright install-deps
COPY . .
RUN npx playwright install
EXPOSE 3000
CMD ["npm", "start"]

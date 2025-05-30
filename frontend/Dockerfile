FROM node:18

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Serve with a simple static file server
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist"]

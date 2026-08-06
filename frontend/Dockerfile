FROM node:22-alpine

WORKDIR /app

# Copy package requirements and install dependencies
COPY package*.json ./
RUN npm ci

# Copy frontend source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Run Vite dev server bound to all network interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

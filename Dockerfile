FROM node:22-slim

WORKDIR /app

# Copy root package.json and install root deps
COPY package*.json ./
RUN npm install

# Copy and install server deps
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy and install client deps
COPY /client/package*.json ./client/
RUN cd client && npm install

# Copy all source code
COPY . .

# Expose both frontend and backend ports
EXPOSE 5173 5000

# Default command to run both client and server
CMD ["npm", "run", "dev"]

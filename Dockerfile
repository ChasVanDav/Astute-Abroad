FROM node:23.10.0

WORKDIR /app

# Copy root package.json and install root deps
COPY package*.json ./
RUN npm install

# Copy and install client deps
COPY client/package*.json ./client/
RUN cd client && npm install

# Copy and install server deps
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy the rest of the project
COPY . .

EXPOSE 5173 5000

CMD ["npm", "run", "dev"]

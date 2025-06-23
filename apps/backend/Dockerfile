# Dockerfile for building a Node.js application with TypeScript and Prisma
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY .env.example ./

# Copy the source code
COPY src ./src
COPY public ./public

# Install global dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Run build script (i have typescript)
RUN npm run build

# Open port 3001
EXPOSE 3001

# Start the application
CMD ["sh", "-c", "npx wait-port db:5432 && npx prisma migrate deploy && npm run seed && npm start"]
# Base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy dependencies
COPY package*.json ./
COPY tsconfig.json ./

# Install deps
RUN npm install

# Copy source code
COPY ./src ./src

# Build TypeScript -> JavaScript
RUN npm run build

# Expose port
EXPOSE 3000

# Run app
CMD ["npm", "start"]

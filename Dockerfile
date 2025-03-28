# Use official Node.js image as base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for efficient caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the API port (change if needed)
EXPOSE 3000

# Command to start the app
CMD ["npm", "start"]

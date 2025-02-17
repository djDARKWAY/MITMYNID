# Use Node.js base image
FROM node:16-slim

# Set non-root user
USER node

# Create app directory
RUN mkdir -p /home/node/app

# Set working directory
WORKDIR /home/node/app

# Copy dependency files
COPY --chown=node package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY --chown=node . .

# Build the app
RUN npm run build

# Set environment variables
ENV HOST=0.0.0.0 \
    PORT=3000

# Expose port
EXPOSE ${PORT}

# Start the app
CMD [ "node", "." ]

FROM node:20-bullseye

# Install basic development tools
RUN apt update && apt install -y git procps curl

# Set the working directory
WORKDIR /workspace

# Install global node packages
RUN npm install -g npm@latest

# Set up permissions
RUN mkdir -p /home/node/.vscode-server/extensions \
    && chown -R node:node /home/node/.vscode-server

# Clean up
RUN apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

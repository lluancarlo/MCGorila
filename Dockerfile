FROM node:22.11.0

# Create the directory!
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

# Copy and Install our bot
COPY package.json /usr/src/bot
RUN npm install

COPY . .
CMD [ "node", "bot.js" ]
FROM node

# Install nodemon for hot reloading
RUN npm install -g nodemon --silent
RUN npm i knex -g --silent

# Create and set the working directory
RUN mkdir -p /app/server
WORKDIR /app/server

# Copy the dependency files over
COPY package*.json /app/server/

# Install dependencies
RUN npm install --silent

# Copy the server files over
COPY . /app/server/

RUN npm install -g pm2 --silent

ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

CMD ["pm2", "server.js"]
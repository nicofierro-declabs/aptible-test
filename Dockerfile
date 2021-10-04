FROM node:14

# Create app directory
WORKDIR /api

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install -g knex
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Run migrations and seeds
# RUN knex migrate:latest --knexfile ./src/config/db/knexfile.ts
# RUN knex seed:run --knexfile ./src/config/db/knexfile.ts

ENV PORT 5000
EXPOSE 5000

CMD ["npm", "run", "dev"]
FROM node:alpine

# Create sentimeter directory
RUN mkdir /jsonyml
WORKDIR /jsonyml

# Variables
ENV NODE_ENV production

# Install
COPY . /jsonyml

RUN npm install .
EXPOSE 8080
CMD ["node", "index.js"]

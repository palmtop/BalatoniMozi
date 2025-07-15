FROM node:20
ENV NODE_ENV=production
#ENV NODE_OPTIONS="--inspect=0.0.0.0:9229"
WORKDIR /usr/src/app
RUN npm install -g nodemon typescript
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 9002
EXPOSE 9229
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "run", "dev"]

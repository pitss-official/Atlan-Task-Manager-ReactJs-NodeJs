FROM node:alpine as builder
WORKDIR /frontend
COPY ./package.json /frontend
RUN npm install --silent
COPY . .
RUN npm run build
FROM nginx
COPY --from=builder /frontend/build /usr/share/nginx/html
COPY ./ngnix.conf /etc/nginx/conf.d/default.conf
# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:12 as build-stage
# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build
COPY . .
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
#RUN rm -rf /etc/nginx/conf.d/default.conf
#COPY ./nginx.conf /etc/nginx/conf.d/default.conf
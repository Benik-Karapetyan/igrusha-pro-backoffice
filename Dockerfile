# build stage
FROM node:latest as build-stage
WORKDIR /app
RUN npm i -g vite
COPY package*.json ./
RUN npm i
COPY . .

#RUN cp .env.master .env

# Define an ARG variable to capture the environment variable passed during build
ARG DockerBuildArgs
ENV DockerBuildArgs=${DockerBuildArgs}
RUN printf "%s\n" $DockerBuildArgs > .env

RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
WORKDIR /app
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
COPY entrypoint.sh .
RUN chmod +x /app/entrypoint.sh
RUN apk add bash
CMD ["nginx", "-g", "daemon off;"]

# docker build . -t myproj            -> builds docker image called myproj with this DockerFile
# docker run -p 5173:5173 -it myproj  -> creates and runs new docker container in interactive mode from image myproj
# docker start -i <id>                -> starts exited container in interactive mode

FROM node:18.16.0

WORKDIR /app

COPY . /app

RUN npm ci

EXPOSE 5173

CMD npm run dev
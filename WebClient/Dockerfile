# docker build . -t myproj
# docker run -p 5173:5173 -d myproj

FROM node:18.14.2

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 5173

CMD npm run dev
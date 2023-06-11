# docker build . -t myproj            -> builds docker image called myproj with this DockerFile
# docker run -p 5173:5173 -it myproj  -> creates and runs new docker container in interactive mode from image myproj
# docker start -i <id>                -> starts exited container in interactive mode

# Creates the Docker Image for the application by specifing the base image and the commands to create the image.
# It uses node18.16.0. Specifying the image/environment it needs to have to run the application.
FROM node:18.16.0
# Application container directory.
WORKDIR /app
# Copy everything from current direcotry to the app direcotry.
COPY . /app
# Install the dependencies to the local node_modules folder.
RUN npm install
# Informs Docker that the container listens on the specified network port at runtime. EXPOSE does not make the ports of the container accessible to the host. It makes it available only for inter-container communication.
# So you use it if you want only other containers to communicate with your application container and not the host.
EXPOSE 5173
# Run the application.
CMD npm run dev
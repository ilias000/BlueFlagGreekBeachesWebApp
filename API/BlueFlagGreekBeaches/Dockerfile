# Creates the Docker Image for the application by specifing the base image and the commands to create the image.
# It uses Java 17. Specifying the image/environment it needs to have to run the application.
FROM openjdk:17-alpine
# Find jar file.
ARG JAR_FILE=build/libs/*.jar
# Rename the jar file.
COPY ${JAR_FILE} application.jar
# Compile the application.
ENTRYPOINT ["java", "-jar", "application.jar"]
# Informs Docker that the container listens on the specified network port at runtime. EXPOSE does not make the ports of the container accessible to the host. It makes it available only for inter-container communication.
# So you use it if you want only other containers to communicate with your application container and not the host.
EXPOSE 8080
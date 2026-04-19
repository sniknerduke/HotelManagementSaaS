# Stage 1: Build
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy parent POM and all module POMs first for dependency caching
COPY pom.xml ./
COPY user-service/pom.xml ./user-service/
COPY inventory-service/pom.xml ./inventory-service/
COPY booking-service/pom.xml ./booking-service/
COPY payment-service/pom.xml ./payment-service/

# Download dependencies (cached layer)
RUN mvn dependency:go-offline -pl user-service -am -q || true

# Copy source and build
COPY user-service/src ./user-service/src
RUN mvn package -pl user-service -am -DskipTests -q

# Stage 2: Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/user-service/target/quarkus-app /app/

EXPOSE 8081
ENV JAVA_OPTS="-Djava.util.logging.manager=org.jboss.logmanager.LogManager"

ENTRYPOINT ["java", "-jar", "/app/quarkus-run.jar"]

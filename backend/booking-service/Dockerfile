# Stage 1: Build
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

COPY pom.xml ./
COPY user-service/pom.xml ./user-service/
COPY inventory-service/pom.xml ./inventory-service/
COPY booking-service/pom.xml ./booking-service/
COPY payment-service/pom.xml ./payment-service/

RUN mvn dependency:go-offline -pl booking-service -am -q || true

COPY booking-service/src ./booking-service/src
RUN mvn package -pl booking-service -am -DskipTests -q

# Stage 2: Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/booking-service/target/quarkus-app /app/

EXPOSE 8083
ENV JAVA_OPTS="-Djava.util.logging.manager=org.jboss.logmanager.LogManager"

ENTRYPOINT ["java", "-jar", "/app/quarkus-run.jar"]

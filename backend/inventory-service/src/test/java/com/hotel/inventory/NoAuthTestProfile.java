package com.hotel.inventory;

import io.quarkus.test.junit.QuarkusTestProfile;
import java.util.Map;

/**
 * Test profile that:
 * 1. Disables all security/auth so tests can call any endpoint without tokens
 * 2. Uses H2 in-memory database instead of PostgreSQL (no Docker needed)
 */
public class NoAuthTestProfile implements QuarkusTestProfile {

    @Override
    public Map<String, String> getConfigOverrides() {
        return Map.ofEntries(
                // Disable JWT auth completely
                Map.entry("quarkus.smallrye-jwt.enabled", "false"),
                // Allow all requests without any auth check
                Map.entry("quarkus.http.auth.permission.permit-all.paths", "/*"),
                Map.entry("quarkus.http.auth.permission.permit-all.policy", "permit"),
                Map.entry("quarkus.http.auth.proactive", "false"),
                // Use H2 in-memory database (no Docker needed)
                Map.entry("quarkus.datasource.db-kind", "h2"),
                Map.entry("quarkus.datasource.jdbc.url", "jdbc:h2:mem:testdb;MODE=PostgreSQL;DB_CLOSE_DELAY=-1"),
                Map.entry("quarkus.datasource.devservices.enabled", "false"),
                Map.entry("quarkus.hibernate-orm.database.generation", "drop-and-create"),
                Map.entry("quarkus.hibernate-orm.sql-load-script", "no-file"),
                Map.entry("quarkus.hibernate-orm.log.sql", "false")
        );
    }
}

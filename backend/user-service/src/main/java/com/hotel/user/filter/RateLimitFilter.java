package com.hotel.user.filter;

import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import java.io.IOException;
import java.time.Duration;

@Provider
@Priority(Priorities.AUTHENTICATION - 10) // Run before authentication
public class RateLimitFilter implements ContainerRequestFilter {

    @Inject
    ProxyManager<String> proxyManager;

    @ConfigProperty(name = "ratelimit.capacity", defaultValue = "20")
    int capacity;

    @ConfigProperty(name = "ratelimit.refill.tokens", defaultValue = "20")
    int refillTokens;

    @ConfigProperty(name = "ratelimit.refill.period", defaultValue = "1m")
    String refillPeriod;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        // Simple identifier: IP Address (can be extended to use User ID from JWT)
        String remoteAddr = requestContext.getUriInfo().getQueryParameters().getFirst("remote_addr"); // Fallback for local testing
        if (remoteAddr == null) {
            // In a real proxy scenario (like Kong), IP is usually in X-Forwarded-For
            String forwardedFor = requestContext.getHeaderString("X-Forwarded-For");
            remoteAddr = (forwardedFor != null) ? forwardedFor.split(",")[0] : "anonymous";
        }

        String key = "ratelimit:user:" + remoteAddr;

        BucketConfiguration config = BucketConfiguration.builder()
                .addLimit(limit -> limit.capacity(capacity).refillGreedy(refillTokens, parseDuration(refillPeriod)))
                .build();

        var bucket = proxyManager.builder().build(key, () -> config);

        if (!bucket.tryConsume(1)) {
            requestContext.abortWith(Response.status(Response.Status.TOO_MANY_REQUESTS)
                    .entity("{\"error\": \"Too many requests. Please slow down.\"}")
                    .build());
        }
    }

    private Duration parseDuration(String period) {
        if (period.endsWith("m")) return Duration.ofMinutes(Long.parseLong(period.replace("m", "")));
        if (period.endsWith("s")) return Duration.ofSeconds(Long.parseLong(period.replace("s", "")));
        if (period.endsWith("h")) return Duration.ofHours(Long.parseLong(period.replace("h", "")));
        return Duration.ofMinutes(1);
    }
}

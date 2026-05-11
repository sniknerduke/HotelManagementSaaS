package com.hotel.user.config;

import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.redis.lettuce.cas.LettuceBasedProxyManager;
import io.github.bucket4j.distributed.ExpirationAfterWriteStrategy;
import io.lettuce.core.RedisClient;
import io.lettuce.core.codec.ByteArrayCodec;
import io.lettuce.core.codec.RedisCodec;
import io.lettuce.core.codec.StringCodec;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import java.time.Duration;

@ApplicationScoped
public class RateLimitConfig {

    @ConfigProperty(name = "quarkus.redis.hosts", defaultValue = "redis://localhost:6379")
    String redisUrl;

    @Produces
    @ApplicationScoped
    public RedisClient redisClient() {
        // If quarkus.redis.hosts starts with redis:// it uses it directly
        return RedisClient.create(redisUrl);
    }

    @Produces
    @ApplicationScoped
    public ProxyManager<String> proxyManager(RedisClient redisClient) {
        // Connect to Redis using String key and Byte array value (for bucket state)
        var connection = redisClient.connect(RedisCodec.of(StringCodec.UTF8, ByteArrayCodec.INSTANCE));
        
        return LettuceBasedProxyManager.builderFor(connection)
                .withExpirationStrategy(ExpirationAfterWriteStrategy.basedOnTimeForRefillingBucketUpToMax(Duration.ofHours(1)))
                .build();
    }
}

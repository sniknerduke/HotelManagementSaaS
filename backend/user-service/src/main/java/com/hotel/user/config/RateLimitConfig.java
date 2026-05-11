package com.hotel.user.config;

import com.bucket4j.distributed.ProxyManager;
import com.bucket4j.redis.lettuce.cas.LettuceBasedProxyManager;
import io.lettuce.core.RedisClient;
import io.lettuce.core.codec.ByteArrayCodec;
import io.lettuce.core.codec.RedisCodec;
import io.lettuce.core.codec.StringCodec;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.inject.Inject;
import java.time.Duration;

@ApplicationScoped
public class RateLimitConfig {

    @Inject
    RedisClient redisClient;

    @Produces
    @ApplicationScoped
    public ProxyManager<String> proxyManager() {
        // Connect to Redis using String key and Byte array value (for bucket state)
        var connection = redisClient.connect(RedisCodec.of(StringCodec.UTF8, ByteArrayCodec.INSTANCE));
        
        return LettuceBasedProxyManager.builderFor(connection)
                .withExpirationStrategy(com.bucket4j.distributed.ExpirationAfterWriteStrategy.basedOnTimeForRefillingBucketUpToMaxTime(Duration.ofHours(1)))
                .build();
    }
}

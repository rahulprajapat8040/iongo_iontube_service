import Redis from "ioredis";
import { RedisConfig } from "./redis.config";

export const redisClient = new Redis(RedisConfig)
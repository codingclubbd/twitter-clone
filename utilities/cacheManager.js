const redis = require("redis");
const redisClient = redis.createClient();
const defaultCacheExpirationTime = 1000 * 60; // 7 days

// getting and setting cache
const getAndSetCache = async (key, cb) => {
  try {
    const data = await redisClient.get(key);
    if (data) {
      return JSON.parse(data);
    } else {
      const newData = await cb();
      redisClient.setEx(
        key,
        defaultCacheExpirationTime,
        JSON.stringify(newData)
      );
      return newData;
    }
  } catch (error) {
    console.log(error);
  }
};

// updating cache
const updateCache = async (key, value) => {
  try {
    await redisClient.setEx(
      key,
      defaultCacheExpirationTime,
      JSON.stringify(value)
    );
  } catch (error) {
    console.log(error);
  }
};
// updating cache
const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  deleteCache,
  redisClient,
  getAndSetCache,
  updateCache,
};

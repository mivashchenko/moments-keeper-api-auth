import serverApi from './clients/server.client';
import mongoClient from './clients/mongo.client';

Promise.resolve().then(async () => {
  await mongoClient.start();
  serverApi.start();

  const shutdown = async () => {
    try {
      serverApi.stop();
      await mongoClient.stop();
      process.exit();
    } catch (error) {
      console.error('error in trying to shutdown:', {
        error: JSON.stringify(error),
        method: 'shutdown()'
      });
      process.exit(1);
    }
  };

  process.on('SIGINT', async () => {
    const msg = `Got SIGINT (aka ctrl-c in docker). Graceful shutdown ${new Date().toISOString()}`;
    console.log(msg);

    await shutdown();
  });

  process.on('SIGTERM', async () => {
    const msg = `Got SIGTERM (docker container stop). Graceful shutdown ${new Date().toISOString()}`;
    console.log(msg);

    await shutdown();
  });
});

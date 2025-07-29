import { createApp } from './app';

const main = async () => {
  const app = createApp();

  try {
    const result = await app.listen({ port: 3000 });
    console.log(result);

    console.log(`Server running on port ${result}`);
  } catch (error) {
    app.log.error(error);
  }
};

main();

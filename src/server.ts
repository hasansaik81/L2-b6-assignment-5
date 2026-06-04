import app from './app';
import config from './config';

async function main() {
  try {
    app.listen(config.PORT, () => {
      console.log(`Example app listening on port ${config.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();




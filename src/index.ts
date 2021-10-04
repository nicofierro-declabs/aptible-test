import App from './App';
import config from './config/config';
import logger from './utils/logger';

const { PORT } = config;
const app = new App().express;

export default app.listen(PORT, () => {
  logger.info(`Server is listening on port: ${PORT}`);
});
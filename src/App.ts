import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import { Model } from 'objection';
import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import { healthCheck } from './utils/healthCheck';
import { errorCatcher } from './middlewares/errorControl';
import api from './api';
import db from './config/db/knex';


class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.setDataBase();
    this.setMiddlewares();
    this.setRoutes();
  }

  private setDataBase(): void {
    Model.knex(db);
  }
  
  private setMiddlewares(): void {
    this.express.use(errorCatcher);
    this.express.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
    this.express.use(json());
    this.express.use(urlencoded({ extended: false }));
    this.express.use(helmet());
    this.express.use(cookieParser());
  }
  
  private setRoutes(): void {
    this.express.get('/health', healthCheck);
    this.express.use('/api', api);
    this.express.get('*', (_, res) => res.status(404).send()); // Not found error
  }
}

export default App;
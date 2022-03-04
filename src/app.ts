import * as express from "express";
import * as cors from 'cors'
import 'reflect-metadata';
import './database';
import { routes } from './routes';

const app = express();

app.use(express.json());
app.use(routes);
app.use(cors())

export default app;

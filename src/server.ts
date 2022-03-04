import app from './app';
import 'reflect-metadata';
import './database';

app.listen(3006, () => {
  console.log('🏃 Running Server');
});

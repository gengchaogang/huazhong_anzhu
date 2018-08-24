import dva from 'dva'
import 'babel-polyfill';
import createLogger from 'redux-logger';
import './index.css'

import myapp from './myapp'
// console.log(myapp)
// console.log(typeof(myapp.router))

// 1. Initialize
// const app = dva({
//     onAction: createLogger(),
// });
const app = dva()

// 2. Plugins
//app.use({});

// 3. Model
//app.model(require('./models/example'));
myapp.models.map(mdl => app.model(mdl))

// 4. Router
// app.router(require('./default/router'));
app.router(myapp.router)

// 5. Start
app.start('#root')

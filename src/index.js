const express = require('express');
const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');
const app = express();

app.use(express.json());
app.use('/', userRoutes);
app.use('/', blogRoutes);

const port = 3000;
app.listen(3000, () => { console.log(`server started and running at port:${port}`) });

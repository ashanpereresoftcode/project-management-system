
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const applicationHeaders = require('./helpers/header-middleware');
const authJwtMiddleWare = require('./helpers/auth-token-middleware');
const errorHanlder = require('./helpers/error-handler-middleware');

// ROUTES
const roleRoutes = require('./routes/role-route');
const permissionRoutes = require('./routes/permission-route');
const userRoutes = require('./routes/user-route');

const app = express()
require('dotenv').config({ path: `./env-${process.env.NODE_ENV}.env` })

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors({ origin: { global: true } }));
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }))
app.use(authJwtMiddleWare());
app.use(applicationHeaders);
app.use(errorHanlder.applicationErrorHandler);

const environmentConfigs = process.env;

app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.permissionContrllerRoute}`, permissionRoutes);
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.roleControllerRoute}`, roleRoutes);
app.use(`${environmentConfigs.baseEndpointUrl}${environmentConfigs.apiVersion}${environmentConfigs.userControllerRoute}`, userRoutes);

module.exports = app;
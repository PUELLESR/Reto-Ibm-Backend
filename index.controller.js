const { Pool } = require('pg');
const poll = new Pool ({
    host: 'database-ibm.cblyx9r9oy2i.us-west-2.rds.amazonaws.com',
    user: 'postgres',
    password: 'postgres',
    database: 'operacion',
    port: '5432'
});

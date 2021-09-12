const { Pool } = require('pg');
const poll = new Pool ({
    host: 'database-ibm.cblyx9r9oy2i.us-west-2.rds.amazonaws.com',
    user: 'postgres',
    password: 'postgres',
    database: 'operacion',
    port: '5432'
});

/*const createUser = async (req, res) => {
    const { _sumando01, _sumando02, _resultado } = req.body;

    const response = await pool.query('INSERT INTO operacion (sumando01, sumando02, resultado) VALUES ($_sumando01, $_sumando02, $_resultado)', [_sumando01, _sumando02, _resultado])
    res.sent('operacion ok')
}

const getSuma = async (req, res) => {
    const response = await pool.query('SELECT * FROM sumando');
    res.status(200).json(response.rows);
}

module.exports = {
    createUser,
    getSuma

}
*/

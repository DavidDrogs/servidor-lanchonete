const Database = require("better-sqlite3");

const db = new Database("lanchonete.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        telefone TEXT,
        itens TEXT,
        total REAL,
        pagamento TEXT,
        data TEXT
    )
`);

module.exports = db;
const db = require("./banco.js");

const buscar = db.prepare("SELECT * FROM pedidos");
const todosPedidos = buscar.all();

console.log(todosPedidos);
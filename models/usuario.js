import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre:String,
    apellidos:String,
    matricula:String,
    anio_ingreso:String,
    periodo:String,
    creditos_actuales:String,
    correo:String,
    password:String,
    ueasSeleccionadas:Array
});

const Usuario = mongoose.model('Usuario',usuarioSchema);
//mongose busca la coleccion 'usuarios' en la base de datos de MongoDB

//module.exports = Uea;
export default Usuario;
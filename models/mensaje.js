import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const mensajeSchema = new Schema({
    origen:String,
    destino:String,
    status:Boolean,
    titulo:String,
    cuerpo:String,
    fechaEnvio:String,
    horaEnvio:String
});

const Mensaje = mongoose.model('Mensaje',mensajeSchema);
//mongose busca la coleccion 'usuarios' en la base de datos de MongoDB

//module.exports = Uea;
//export default ueaSchema;
export default Mensaje;
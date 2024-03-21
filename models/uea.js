import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ueaSchema = new Schema({
    clave:String,
    nombre:String,
    tipo:String,
    h_teoria:String,
    h_practica:String,
    creditos:String,
    seriacion:Array,
    coregistro:Array,
    tronco: String
});

const Uea = mongoose.model('Uea',ueaSchema);
//mongose busca la coleccion 'usuarios' en la base de datos de MongoDB

//module.exports = Uea;
//export default ueaSchema;
export default Uea;
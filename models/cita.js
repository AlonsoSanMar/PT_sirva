import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const citaSchema = new Schema({
    correo_tutor:String,
    id_cita:String,
    titulo:String,
    fechaInicio:Date,
    fechaTermino:Date,
    bgColor:String
});

const Cita = mongoose.model('Cita',citaSchema);
//mongose busca la coleccion 'usuarios' en la base de datos de MongoDB

//module.exports = Uea;
//export default ueaSchema;
export default Cita;
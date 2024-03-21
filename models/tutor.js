import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const tutorSchema = new Schema({
    nombre:String,
    apellidos:String,
    correo:String,
    password:String,
    tutorados:Array
});

const Tutor = mongoose.model('Tutore',tutorSchema); //Tuve que poner Tutore para que en mongo detecte la coleccion tutores y no ponga en tutors
//mongose busca la coleccion 'tutores' en la base de datos de MongoDB

//module.exports = Uea;
export default Tutor;
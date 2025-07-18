import express from 'express';
import bodyParser from 'body-parser';
import { valid } from './validador.js';
import bcrypt from "bcryptjs";

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
  res.json({saludo:'Hello World'})

})

app.post('/registro',valid,async(req,res)=>{
    const info=req.body;

    console.log(info);
    

    const nombre=info.nombre;
    const correo=info.correo;
    const contrasena=info.contrasena;
    console.log(contrasena);
    

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasena, salt);
    console.log(hash);
    

    // console.log("hola hola");
    
})

app.listen(3000)


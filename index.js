import express from 'express';
import bodyParser from 'body-parser';
import { valid,validLogin, validToken } from './validador.js';
import bcrypt from "bcryptjs";
import mysql2 from "mysql2/promise";
import  jwt  from 'jsonwebtoken';
import cors from 'cors';

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
  res.json({saludo:'Hello World'})

})


const conexion= async()=>{return await mysql2.createConnection({
  host:"localhost",
  user:"nmanuel07",
  password:"Aprendiz2024",
  database:"node_sena"
})}


app.post('/registro',valid,async(req,res)=>{
    const info=req.body;
  
    const nombre=info.nombre;
    const correo=info.correo;
    const contrasena=info.contrasena;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasena, salt);
    // console.log(await bcrypt.compare(contrasena, hash));

    const sql="INSERT INTO usuarios(nombre,email,password) VALUES (?,?,?)";
    const atributos=[nombre,correo,hash];

    const pepito=await conexion();
    
    const consulta= await pepito.query(sql,atributos);

    console.log(consulta);
    
})

app.post('/login',validLogin,async (req,res)=>{
  const {correo,contrasena}=req.body;

  const pepito=await conexion();
  const sql="SELECT * FROM usuarios WHERE email=?";
  const sqlPermisos ="select R.nombre, P.nombre, P.descripcion from roles as R inner join permiso_rol as PR on R.id = PR.rol_id inner join permisos P on PR.permisos_id =  P.id where R.id = ?";
  const sqlRoles = "select r.* , ru.rol_id from roles r   inner join rol_usuario ru on  r.id  = ru.rol_id where ru.usuario_id = ?"
  const atributos=[correo];
  
  const consulta= await pepito.query(sql,atributos);
  
  
  const user=consulta[0][0];
  if( !await bcrypt.compare(contrasena, user.password)){
    return res.json("No puede ingresar contraseña o correo incorrecto")
  }
  
  const token= jwt.sign({id:user.id,nombre:user.nombre},"palabraLlavePrivada",{expiresIn:"1m"});
  const tokenRefresch= jwt.sign({id:user.id,nombre:user.nombre},"palabraRefresco",{expiresIn:"7d"});
  console.log(token);
  
  const consultarRol = await pepito.query(sqlRoles,[user.id]);
  

  const rol_id = consultarRol[0][0].rol_id;

  const consultarPerms = await pepito.query(sqlPermisos,[rol_id]);
  
  const permisos = consultarPerms[0];
  
  

  return res.json({token,tokenRefresch,permisos});
  
})

app.get('/privada',validToken, (req,res)=>{
  
  
})
app.post('/refrescar',(req,res)=>{
  const{refreshtoken} = req.body;
  const decoded = jwt.verify(refreshtoken, 'palabraRefresco', (err,decoded)=>{
    console.log(decoded);
    
  });
  // console.log(decoded);
  

})

app.listen(3000)


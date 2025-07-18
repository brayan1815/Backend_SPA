import  jwt  from 'jsonwebtoken';

export const valid=(req,res,next)=>{
    const {nombre,correo,contrasena}=req.body;

    if(!nombre)return res.json({error:"El nombre no puede estar vacio"});
    if(!correo)return res.json({error:"El correo no puede estar vacio"});
    if(!contrasena)return res.json({error:"La contraseña no puede estar vacia"});

    next()
}

export const validLogin=(req,res,next)=>{
    const {correo,contrasena}=req.body;

    if(!correo)return res.json({error:"El correo no puede estar vacio"});
    if(!contrasena)return res.json({error:"La contraseña no puede estar vacia"});

    next()
}

export const validToken = (req,res,next) =>{
    try {
        console.log(req.headers);
        const cabecero = req.headers;
        if(!cabecero.authorization || !cabecero.authorization.includes("Bear")){
            return res.json("formato no valido");
        }
        const arraglo = cabecero.authorization.split("   ")
        console.log(arraglo[1]);
        const token = arraglo[1];
        const decoded = jwt.verify(token, 'palabraLlavePrivada');
        console.log(decoded);
    } catch (error) {
        
    }
    
    next();
}
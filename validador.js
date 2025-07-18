
export const valid=(req,res,next)=>{
    const {nombre,correo,contrasena}=req.body;

    if(!nombre)return res.json({error:"El nombre no puede estar vacio"});
    if(!correo)return res.json({error:"El correo no puede estar vacio"});
    if(!contrasena)return res.json({error:"La contraseña no puede estar vacia"});

    next()
}
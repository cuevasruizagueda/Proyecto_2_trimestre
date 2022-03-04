// Queremos saber el número de sesiones que ha realizado cada persona:

 db.clientes.aggregate(                                  
    [                                
  {$group:                         
    { _id:"$Nombre",         
              num_sesiones:          
                        {$sum:1}  
             }
      }
     ]
   )

/*QUIERO SABER LAS UNIDADES TOTALES QUE TENGO DE CADA CATEGORIA*/
db.proveedores.aggregate( [
  {  $group: {  _id:"$Categoría", 
  Cantidad:{ $sum: 1 },
  CantidadCategoría:{$sum: "$Cantidad"} }}
] )




 // Crear colección productos a partir de la colección proveedores 
db.proveedores.aggregate([
  {
      $project: { Producto: 1, Categoría:1 ,Cantidad: 1,
        Precioporunidad: 1, Servicio: 1}                     
  },
  {
      $out: { db:"proyect2", coll:"productos" }
  }
]) 

// Calculamos la media de precio de todos los productos que compramos.

db.productos.aggregate([
    {$group: 
        {
            _id: "$producto",
            MediaPrecio: {$avg: {$sum: "$Precioporunidad"}}     
        }
    
    
    }
]).pretty()



//Quiero separar cada producto de su servicio, es decir "quitar el array"

db.proveedores.aggregate(
  { $project : {
    Producto: 1,
      Categoría : 1 ,
      Cantidad : 1 ,
      Servicio : 1
  }},
  { $unwind : "$Servicio" }
).pretty()


//Necesitamos conocer el año que compramos cada producto por separado
db.proveedores.aggregate(
  [
  { $sort: { fecha_compra: 1, Producto: 1 } },
  {
      $group:
        {
          _id: { day: { $dayOfYear: "$date"}, year: { $year: "$fecha_compra" } },
          itemsSold: { $push:  { Producto: "$Producto", Cantidad: "$Cantidad" } }
        }
    }
  ]
).pretty()

// Crear colección productos a partir de la colección proveedores 
db.clientes.aggregate([
  {
      $project: { Nombre: 1, Servicio:1 ,Precio: 1,
        Pago: 1}                     
  },
  {
      $out: { db:"proyect2", coll:"service" }
  }
]) 

//Relacionar cada cliente con sus correspondientes datos con el producto o productos que se han utilizado en el servicio prestado. 
db.service.aggregate([    
  {      $lookup:        
    {          from: "productos",         
     localField: "Servicio.id",        
       foreignField: "id",         
        as: "Producto"        }   } ]).pretty()

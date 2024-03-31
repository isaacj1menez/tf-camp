interface GetCampersResponse {
    "status": String,
    "total": Number,
    "data": Camper[]
}

interface Camper {
    "_id": String,
    "nombre": String
    "edad": Number,
    "sexo": String,
    "telefono": String
    "iglesia": String
    "talla": String
    "contacto": String
    "nombre_contacto": String
    "telefono_contacto": String
    "alergias": [],
    "tipo_sangre": String,
    "medicamentos": [],
    "comentarios": String,
    "registro": String,
    "fecha_registro": string
}

export {
    GetCampersResponse,
    Camper
}
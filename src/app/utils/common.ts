const formatMongoDate = (fecha_input: string): Date | null => {
    const newDate: Date = new Date(fecha_input);
    return newDate;
}

const getContacto = (contacto: string) => {
    switch(contacto) {
        case 'P': return 'Papá';
        case 'M': return 'Mamá';
        case 'CG': return 'Contacto General';
        default: return '';
    }
}

export {
    formatMongoDate,
    getContacto
}
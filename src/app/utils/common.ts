const formatMongoDate = (fecha_input: string): Date | null => {
    const newDate: Date = new Date(fecha_input);
    return newDate;
}

const formatRegister = (register: String) => {
    if(register.length === 1) return '00';
    if(register.length === 2) return '0';

    return ''
}

export {
    formatMongoDate,
    formatRegister
}
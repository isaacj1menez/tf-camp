const formatMongoDate = (fecha_input: String): Date | null => {
    const partes = fecha_input.split(', ');

    if (partes.length !== 2) {
        return null;
    }

    const fecha = partes[0];
    const hora = partes[1];

    const [dia, mes, año] = fecha.split('/').map(Number);

    const [horaNum, minuto, segundo] = hora.split(':').map(Number);

    const fechaDate = new Date(año, mes - 1, dia, horaNum, minuto, segundo);

    return fechaDate;
}

export {
    formatMongoDate
}
/**
 * Formatea un rango de fechas para la interfaz de usuario.
 * Retorna un objeto con las fechas formateadas para evitar colisiones de nombres.
 */
export const formatBookingDates = (start: string, end: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return {
        formattedStart: new Date(start).toLocaleDateString('en-US', options),
        formattedEnd: new Date(end).toLocaleDateString('en-US', options),
    };
};
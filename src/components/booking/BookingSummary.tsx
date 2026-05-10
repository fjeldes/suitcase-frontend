// components/booking/BookingSummary.tsx
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BookingSummaryProps {
    items: { small: number; medium: number; large: number };
    pricePerDay: { small: number; medium: number; large: number };
    totalPrice: number;
    days: number; // <--- Agregamos los días
    currency: string; // Recibimos "CLP", "USD", etc.
    receipt?: {    // <--- Agregamos el desglose que viene del backend
        total: number;
        tax: number;
        fee: number;
        net: number;
    } | null;
    status?: string;
    isCanceling?: boolean;
    onCancel?: () => void;
    onViewReceipt?: () => void;
}

export const BookingSummary = ({
    items,
    pricePerDay,
    totalPrice,
    days,
    receipt,
    status,
    isCanceling,
    currency,
    onCancel,
    onViewReceipt,
}: BookingSummaryProps) => {
    const activeItems = Object.entries(items).filter(([_, qty]) => qty > 0);
    const formatter = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: currency === 'CLP' ? 0 : 2,
    });
    return (
        <View style={styles.paymentCard}>
            <Text style={styles.paymentTitle}>Resumen de Pago</Text>

            {activeItems.map(([size, qty]) => {
                const price = pricePerDay[size as keyof typeof pricePerDay] || 0;
                // Subtotal por tipo de item por la cantidad de días
                const subtotal = qty * price * days;

                return (
                    <View key={size} style={styles.paymentRow}>
                        <Text style={styles.payLabel}>
                            {qty}x {size.charAt(0).toUpperCase() + size.slice(1)} ({days} {days > 1 ? 'días' : 'día'})
                        </Text>
                        <Text style={styles.payValue}>${subtotal.toLocaleString()}</Text>
                    </View>
                );
            })}

            {/* Si tenemos el recibo, mostramos el desglose de impuestos de forma sutil */}
            {receipt && (
                <View style={styles.taxContainer}>
                    <View style={styles.divider} />
                    <View style={styles.paymentRow}>
                        <Text style={styles.taxLabel}>IVA (19%) incluido</Text>
                        <Text style={styles.taxValue}>${receipt.tax.toLocaleString()}</Text>
                    </View>
                </View>
            )}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
                <View>
                    <Text style={styles.totalLabel}>Precio Total</Text>
                    <Text style={styles.daysLabel}>{days} {days > 1 ? 'Días de custodia' : 'Día de custodia'}</Text>
                </View>
                <Text style={styles.totalValue}>{formatter.format(totalPrice)}</Text>
            </View>

            {onViewReceipt && (
                <TouchableOpacity style={styles.receiptButton} onPress={onViewReceipt}>
                    <Text style={styles.receiptButtonText}>View Receipt</Text>
                </TouchableOpacity>
            )}

            {onCancel && (status === 'confirmed' || status === 'pending') && (
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onCancel}
                    disabled={isCanceling}
                >
                    {isCanceling ? (
                        <ActivityIndicator color="#E53E3E" />
                    ) : (
                        <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    paymentCard: { backgroundColor: '#162181', borderRadius: 24, padding: 25, marginTop: 10 },
    paymentTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    paymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    payLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
    payValue: { color: '#FFF', fontWeight: '600' },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 15 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    totalLabel: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    totalValue: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
    receiptButton: { backgroundColor: '#FF8A00', padding: 15, borderRadius: 15, alignItems: 'center' },
    receiptButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    cancelButton: { marginTop: 15, padding: 15, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#E53E3E' },
    cancelButtonText: { color: '#E53E3E', fontWeight: 'bold', fontSize: 16 },
    taxContainer: { marginTop: 5 },
    taxLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
    taxValue: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
    daysLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
});
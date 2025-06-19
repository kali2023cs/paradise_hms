import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: 15,
    borderRadius: 6,
    marginBottom: 20,
    textAlign: 'center',
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hotelContact: {
    fontSize: 9,
    marginBottom: 2,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  fromToContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 6,
  },
  fromToSection: {
    width: '45%',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#4f46e5',
  },
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
  },
  detailItem: {
    width: '24%',
  },
  detailLabel: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 6,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e5e7eb',
  },
  tableColHeader: {
    width: '20%',
    padding: 6,
    backgroundColor: '#4f46e5',
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCol: {
    width: '20%',
    padding: 6,
    fontSize: 8,
    textAlign: 'center',
  },
  descriptionCol: {
    width: '20%',
    padding: 6,
    fontSize: 8,
    textAlign: 'left',
  },
  totalsContainer: {
    width: 200,
    marginLeft: 'auto',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 8,
    color: '#6b7280',
  },
  totalValue: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  grandTotal: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#4f46e5',
  },
  footer: {
    marginTop: 15,
    paddingTop: 8,
    borderTop: '1px solid #e5e7eb',
    textAlign: 'center',
    fontSize: 7,
    color: '#6b7280',
  },
  thankYou: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#4f46e5',
    marginBottom: 3,
  },
  sectionDivider: {
    marginVertical: 10,
    borderBottom: '1px dashed #e5e7eb',
  },
  roomDetails: {
    marginTop: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
  },
  roomDetailsHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4f46e5',
    marginBottom: 6,
  },
  paymentDetails: {
    marginTop: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'N/A';
  }
};

const safeParseFloat = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

const InvoicePDF = ({ invoiceData }) => {
  const invoice = invoiceData?.invoice || {};
  const checkout = invoice.checkout || {};
  const checkin = checkout.checkin || {};
  const allRooms = Array.isArray(checkin.rooms) ? checkin.rooms : [];
  const payments = Array.isArray(checkout.payments) ? checkout.payments : [];
  const items = Array.isArray(invoice.items) ? invoice.items : [];
  
  // Filter rooms to only show those mentioned in invoice items
  const invoiceRooms = allRooms.filter(room => {
    return items.some(item => 
      item.description && item.description.includes(`Room ${room.room?.room_number}`)
    );
  });

  // If no rooms found in items but we have rooms, show all rooms
  const displayRooms = invoiceRooms.length > 0 ? invoiceRooms : 
                      (items.length === 0 && allRooms.length > 0 ? allRooms : []);

  // Calculate totals
  const subtotal = safeParseFloat(invoice.subtotal) || 
                  items.reduce((sum, item) => sum + safeParseFloat(item.amount), 0);
  
  const taxAmount = safeParseFloat(invoice.tax_amount) || 
                   items.reduce((sum, item) => {
                     return sum + (safeParseFloat(item.amount) * (safeParseFloat(item.tax_rate) || 0) / 100);
                   }, 0);
  
  const discountAmount = safeParseFloat(invoice.discount_amount) || 
                        safeParseFloat(checkout.discount_amount);
  
  const total = safeParseFloat(invoice.total_amount) || 
               (subtotal + taxAmount - discountAmount);
  
  const amountPaid = safeParseFloat(invoice.amount_paid) || 
                    safeParseFloat(checkout.amount_paid);
  
  const balanceDue = safeParseFloat(invoice.balance_due) || 
                    safeParseFloat(checkout.balance_due);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.hotelName}>Grand Plaza Hotel</Text>
          <Text style={styles.hotelContact}>123 Luxury Avenue, Mumbai, Maharashtra 400001</Text>
          <Text style={styles.hotelContact}>Phone: +91 22 1234 5678 | Email: info@grandplaza.com</Text>
          <Text style={styles.hotelContact}>GSTIN: 27ABCDE1234F1Z5</Text>
          <Text style={styles.invoiceNumber}>INVOICE #{invoice.invoice_number || 'N/A'}</Text>
        </View>

        {/* From/To Sections */}
        <View style={styles.fromToContainer}>
          <View style={styles.fromToSection}>
            <Text style={styles.sectionTitle}>BILL FROM</Text>
            <Text style={{ fontSize: 8, marginBottom: 3 }}>Grand Plaza Hotel</Text>
            <Text style={{ fontSize: 8, marginBottom: 3 }}>123 Luxury Avenue</Text>
            <Text style={{ fontSize: 8, marginBottom: 3 }}>Mumbai, Maharashtra 400001</Text>
            <Text style={{ fontSize: 8 }}>GSTIN: 27ABCDE1234F1Z5</Text>
          </View>
          <View style={styles.fromToSection}>
            <Text style={styles.sectionTitle}>BILL TO</Text>
            <Text style={{ fontSize: 8, marginBottom: 3 }}>
              {[checkin.title, checkin.first_name, checkin.last_name].filter(Boolean).join(' ') || 'Guest Name'}
            </Text>
            <Text style={{ fontSize: 8, marginBottom: 3 }}>{checkin.address || 'Guest Address'}</Text>
            <Text style={{ fontSize: 8, marginBottom: 3 }}>
              {[checkin.city, checkin.pin_code].filter(Boolean).join(', ') || 'City, PIN'}
            </Text>
            {checkin.gst_number && (
              <Text style={{ fontSize: 8 }}>GSTIN: {checkin.gst_number}</Text>
            )}
          </View>
        </View>

        {/* Invoice Details */}
        <View style={styles.invoiceDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>INVOICE DATE</Text>
            <Text style={styles.detailValue}>{formatDate(invoice.invoice_date)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>DUE DATE</Text>
            <Text style={styles.detailValue}>{formatDate(invoice.due_date)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>BOOKING REFERENCE</Text>
            <Text style={styles.detailValue}>{checkin.reservation_number || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>STATUS</Text>
            <Text style={[styles.detailValue, { color: invoice.status === 'Paid' ? '#10b981' : '#ef4444' }]}>
              {invoice.status ? invoice.status.toUpperCase() : 'PENDING'}
            </Text>
          </View>
        </View>

        {/* Room Details */}
        {displayRooms.length > 0 && (
          <View style={styles.roomDetails}>
            <Text style={styles.roomDetailsHeader}>ROOM DETAILS</Text>
            {displayRooms.map((room, index) => (
              <View key={index} style={{ marginBottom: index < displayRooms.length - 1 ? 8 : 0 }}>
                <Text style={{ fontSize: 8, marginBottom: 2 }}>
                  Room: {room.room?.room_number || 'N/A'} ({room.room_type?.name || 'N/A'})
                </Text>
                <Text style={{ fontSize: 8, marginBottom: 2 }}>
                  Check-In: {formatDate(checkin.check_in_datetime)} | Check-Out: {formatDate(checkout.actual_checkout_datetime)}
                </Text>
                <Text style={{ fontSize: 8 }}>
                  Rate: {safeParseFloat(room.net_rate).toFixed(2)} | 
                  Guests: {safeParseFloat(room.male) + safeParseFloat(room.female)} | 
                  Extra: {room.extra || 0}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text>DESCRIPTION</Text></View>
            <View style={styles.tableColHeader}><Text>QTY</Text></View>
            <View style={styles.tableColHeader}><Text>RATE</Text></View>
            <View style={styles.tableColHeader}><Text>TAX %</Text></View>
            <View style={styles.tableColHeader}><Text>AMOUNT</Text></View>
          </View>
          
          {/* Table Rows */}
          {items.length > 0 ? (
            items.map((item, index) => (
              <View style={[styles.tableRow, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb' }]} key={index}>
                <View style={styles.descriptionCol}><Text>{item.description || 'Service'}</Text></View>
                <View style={styles.tableCol}><Text>{safeParseFloat(item.quantity)}</Text></View>
                <View style={styles.tableCol}><Text>{safeParseFloat(item.unit_price).toFixed(2)}</Text></View>
                <View style={styles.tableCol}><Text>{safeParseFloat(item.tax_rate)}%</Text></View>
                <View style={styles.tableCol}><Text>{safeParseFloat(item.amount).toFixed(2)}</Text></View>
              </View>
            ))
          ) : (
            <View style={[styles.tableRow, { padding: 8 }]}>
              <Text style={{ fontSize: 8, width: '100%', textAlign: 'center' }}>No items found</Text>
            </View>
          )}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalLabel}>Tax:</Text>
            <Text style={styles.totalValue}>{taxAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalLabel}>Discount:</Text>
            <Text style={[styles.totalValue, { color: '#ef4444' }]}>-{discountAmount.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalsRow, { marginTop: 6, paddingTop: 4, borderTop: '1px solid #e5e7eb' }]}>
            <Text style={[styles.totalLabel, { fontWeight: 'bold' }]}>Total:</Text>
            <Text style={[styles.totalValue, styles.grandTotal]}>{total.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalsRow, { marginTop: 6 }]}>
            <Text style={styles.totalLabel}>Amount Paid:</Text>
            <Text style={styles.totalValue}>{amountPaid.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalsRow, { marginBottom: 0 }]}>
            <Text style={[styles.totalLabel, { fontWeight: 'bold' }]}>Balance Due:</Text>
            <Text style={[styles.totalValue, { color: '#ef4444', fontWeight: 'bold' }]}>
              {balanceDue.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Payment Details */}
        {payments.length > 0 && (
          <View style={styles.paymentDetails}>
            <Text style={styles.roomDetailsHeader}>PAYMENT DETAILS</Text>
            {payments.map((payment, index) => (
              <View key={index} style={styles.paymentRow}>
                <Text style={{ fontSize: 8 }}>
                  {payment.payment_method} ({formatDate(payment.payment_date)})
                </Text>
                <Text style={{ fontSize: 8, fontWeight: 'bold' }}>
                  {safeParseFloat(payment.payment_amount).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.thankYou}>Thank you for choosing Grand Plaza Hotel!</Text>
          <Text>Payment is due within 7 days. Please make checks payable to Grand Plaza Hotel.</Text>
          <Text>For any inquiries regarding this invoice, please contact our accounts department at accounts@grandplaza.com</Text>
          <Text style={{ marginTop: 4 }}>This is a computer generated invoice and does not require a physical signature.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
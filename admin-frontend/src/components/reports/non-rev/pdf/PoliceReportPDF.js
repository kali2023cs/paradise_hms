// src/components/reports/PoliceReportPDF.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#1976d2',
    paddingBottom: 15
  },
  hotelInfo: {
    flex: 2
  },
  reportInfo: {
    flex: 1,
    alignItems: 'flex-end'
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 5
  },
  hotelAddress: {
    fontSize: 10,
    color: '#555',
    marginBottom: 3
  },
  hotelContact: {
    fontSize: 10,
    color: '#555'
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10
  },
  header: {
    marginBottom: 15,
    textAlign: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1976d2',
    textTransform: 'uppercase'
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 10,
    color: '#555',
    fontStyle: 'italic'
  },
  reportMeta: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#1976d2'
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5
  },
  infoLabel: {
    width: 100,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333'
  },
  infoValue: {
    fontSize: 10,
    color: '#555'
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 20,
    marginBottom: 20
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
    minHeight: 30
  },
  tableHeader: {
    backgroundColor: '#1976d2',
    color: 'white',
    fontWeight: 'bold'
  },
  tableCell: {
    padding: 8,
    fontSize: 9,
    flex: 1,
    textAlign: 'left'
  },
  footer: {
    marginTop: 20,
    fontSize: 8,
    textAlign: 'center',
    color: '#777',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10
  },
  signature: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  signatureLine: {
    width: 200,
    borderTopWidth: 1,
    borderTopColor: '#000',
    marginTop: 40,
    textAlign: 'center',
    paddingTop: 5,
    fontSize: 10
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '30%',
    fontSize: 60,
    color: 'rgba(25, 118, 210, 0.1)',
    transform: 'rotate(-45deg)'
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#999'
  },
  noteSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff9e6',
    borderLeftWidth: 3,
    borderLeftColor: '#ffc107',
    fontSize: 9
  },
  noteTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#ff9800'
  }
});

const PoliceReportPDF = ({ data }) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>CONFIDENTIAL</Text>
        
        {/* Header with Hotel Info */}
        <View style={styles.headerContainer}>
          <View style={styles.hotelInfo}>
            <Text style={styles.hotelName}>{data.hotelDetails?.name || "Grand Plaza Hotel"}</Text>
            <Text style={styles.hotelAddress}>
              {data.hotelDetails?.address || "123 Main Street, City Center"}
            </Text>
            <Text style={styles.hotelAddress}>
              {data.hotelDetails?.city || "Metropolis"}, {data.hotelDetails?.state || "State"}, {data.hotelDetails?.country || "Country"}
            </Text>
            <Text style={styles.hotelContact}>
              Phone: {data.hotelDetails?.phone || "+1 234 567 8900"} | Email: {data.hotelDetails?.email || "info@grandplaza.com"}
            </Text>
            <Text style={styles.hotelContact}>
              License No: {data.hotelDetails?.license || "HOTEL/1234/2023"}
            </Text>
          </View>
          
          <View style={styles.reportInfo}>
            {/* You can add a logo here if available */}
            {/* <Image style={styles.logo} src="/path/to/logo.png" /> */}
            <Text style={{ fontSize: 10, marginBottom: 5 }}>
              Generated On: {currentDate} at {currentTime}
            </Text>
          </View>
        </View>
        
        {/* Report Title */}
        <View style={styles.header}>
          <Text style={styles.title}>OFFICIAL POLICE REPORT</Text>
          <Text style={styles.subtitle}>Confidential - For Official Use Only</Text>
        </View>
        
        {/* Report Metadata */}
        <View style={styles.reportMeta}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Report Date:</Text>
            <Text style={styles.infoValue}>{currentDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Report ID:</Text>
            <Text style={styles.infoValue}>{data.reportId || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Period:</Text>
            <Text style={styles.infoValue}>{data.fromDate} to {data.toDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Purpose:</Text>
            <Text style={styles.infoValue}>{data.purpose}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Report Type:</Text>
            <Text style={styles.infoValue}>
              {data.reportType === 'checkin' ? 'Check-in Records' : 'Check-out Records'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Records:</Text>
            <Text style={styles.infoValue}>{data.reportData.length}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Prepared By:</Text>
            <Text style={styles.infoValue}>{data.preparedBy || 'System Administrator'}</Text>
          </View>
        </View>
        
        {/* Table Header */}
        <View style={[styles.table, styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { flex: 1.5 }]}>Guest Name</Text>
          <Text style={styles.tableCell}>ID Type</Text>
          <Text style={styles.tableCell}>ID Number</Text>
          <Text style={styles.tableCell}>Contact</Text>
          <Text style={styles.tableCell}>Room No</Text>
          <Text style={styles.tableCell}>Room Type</Text>
          <Text style={[styles.tableCell, { flex: 1.2 }]}>Check-In</Text>
          <Text style={[styles.tableCell, { flex: 1.2 }]}>Check-Out</Text>
        </View>
        
        {/* Table Rows */}
        {data.reportData.map((record, index) => (
          <View key={index} style={[styles.tableRow, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }]}>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>
              {`${record.title_name || ''} ${record.first_name} ${record.last_name}`.trim()}
            </Text>
            <Text style={styles.tableCell}>{record.id_type || 'N/A'}</Text>
            <Text style={styles.tableCell}>{record.id_number || 'N/A'}</Text>
            <Text style={styles.tableCell}>{record.contact || 'N/A'}</Text>
            <Text style={styles.tableCell}>{record.room_no || 'N/A'}</Text>
            <Text style={styles.tableCell}>{record.room_type_name || 'N/A'}</Text>
            <Text style={[styles.tableCell, { flex: 1.2 }]}>
              {record.check_in_datetime ? 
                new Date(record.check_in_datetime).toLocaleString() : 'N/A'}
            </Text>
            <Text style={[styles.tableCell, { flex: 1.2 }]}>
              {record.check_out_datetime ? 
                new Date(record.check_out_datetime).toLocaleString() : 'N/A'}
            </Text>
          </View>
        ))}
        
        {/* Notes Section */}
        <View style={styles.noteSection}>
          <Text style={styles.noteTitle}>IMPORTANT NOTES:</Text>
          <Text>
            1. This report contains confidential information and is intended only for official use by authorized personnel.
          </Text>
          <Text>
            2. Any unauthorized disclosure, copying, or distribution is strictly prohibited.
          </Text>
          <Text>
            3. Please verify all guest identification details with original documents when required.
          </Text>
          <Text>
            4. Report generated on {currentDate} at {currentTime}.
          </Text>
        </View>
        
        {/* Signature Area */}
        <View style={styles.signature}>
          <View style={styles.signatureLine}>
            <Text>Prepared By: {data.preparedBy || '_________________'}</Text>
          </View>
          <View style={styles.signatureLine}>
            <Text>Authorized Signature: _________________</Text>
          </View>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text>{data.hotelDetails?.name || "Grand Plaza Hotel"} - Police Report</Text>
          <Text>This document is system generated and requires official stamp/signature for validation</Text>
        </View>
        
        {/* Page Number */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};

export default PoliceReportPDF;
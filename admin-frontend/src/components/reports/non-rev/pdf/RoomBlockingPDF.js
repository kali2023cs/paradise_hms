import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10
  },
  hotelInfo: {
    flex: 2
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  hotelAddress: {
    fontSize: 10,
    marginBottom: 2
  },
  hotelContact: {
    fontSize: 10,
    marginTop: 4
  },
  reportInfo: {
    flex: 1,
    alignItems: 'flex-end'
  },
  header: {
    marginBottom: 20,
    textAlign: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: '#666'
  },
  reportMeta: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5
  },
  infoLabel: {
    width: 120,
    fontSize: 10,
    fontWeight: 'bold'
  },
  infoValue: {
    fontSize: 10,
    flex: 1
  },
  table: {
    width: '100%',
    marginTop: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold'
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: '#ddd'
  },
  noteSection: {
    marginTop: 20,
    padding: 10,
    fontSize: 10,
    borderTop: 1,
    borderColor: '#ddd'
  },
  noteTitle: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    textAlign: 'center',
    color: '#666'
  },
  pageNumber: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    fontSize: 10,
    textAlign: 'center',
    color: '#666'
  }
});

const RoomBlockingPDF = ({ data }) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  // Calculate statistics
  const totalBlocks = data.reportData.length;
  const activeBlocks = data.reportData.filter(b => b.current_status === 'Active').length;
  const expiredBlocks = data.reportData.filter(b => b.current_status === 'Expired').length;
  
  // Calculate average block duration
  const avgDuration = data.reportData.reduce((total, block) => {
    const start = new Date(block.from_date);
    const end = new Date(block.to_date);
    return total + Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }, 0) / (totalBlocks || 1);

  // Calculate longest block
  const longestBlock = data.reportData.length > 0 
    ? Math.max(...data.reportData.map(b => {
        const start = new Date(b.from_date);
        const end = new Date(b.to_date);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      }))
    : 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Hotel Info */}
        <View style={styles.headerContainer}>
          <View style={styles.hotelInfo}>
            <Text style={styles.hotelName}>{data.user?.property_name || "Hotel Management System"}</Text>
            <Text style={styles.hotelAddress}>123 Hotel Street, Hospitality City</Text>
            <Text style={styles.hotelContact}>Phone: (123) 456-7890 | Email: info@hotel.com</Text>
          </View>
          
          <View style={styles.reportInfo}>
            <Text style={{ fontSize: 10 }}>Generated: {currentDate} at {currentTime}</Text>
          </View>
        </View>
        
        {/* Report Title */}
        <View style={styles.header}>
          <Text style={styles.title}>ROOM BLOCKING ANALYSIS REPORT</Text>
          <Text style={styles.subtitle}>
            {data.fromDate} to {data.toDate}
          </Text>
        </View>
        
        {/* Report Metadata */}
        <View style={styles.reportMeta}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Report Period:</Text>
            <Text style={styles.infoValue}>{data.fromDate} to {data.toDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Filters:</Text>
            <Text style={styles.infoValue}>
              {data.filter.reason}, {data.filter.blockedBy}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Blocks:</Text>
            <Text style={styles.infoValue}>{totalBlocks}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Active Blocks:</Text>
            <Text style={styles.infoValue}>{activeBlocks}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Avg Duration:</Text>
            <Text style={styles.infoValue}>{Math.round(avgDuration)} days</Text>
          </View>
        </View>
        
        {/* Table Header */}
        <View style={[styles.table, styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { flex: 0.8 }]}>Room No</Text>
          <Text style={[styles.tableCell, { flex: 1.2 }]}>Reason</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>Blocked By</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>From</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>To</Text>
          <Text style={[styles.tableCell, { flex: 0.8 }]}>Duration</Text>
          <Text style={[styles.tableCell, { flex: 0.8 }]}>Status</Text>
        </View>
        
        {/* Table Rows */}
        {data.reportData.map((block, index) => {
          const start = new Date(block.from_date);
          const end = new Date(block.to_date);
          const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
          
          return (
            <View key={index} style={[styles.tableRow, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }]}>
              <Text style={[styles.tableCell, { flex: 0.8 }]}>{block.room_no}</Text>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>{block.reason}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{block.blocked_by}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{block.from_date}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{block.to_date}</Text>
              <Text style={[styles.tableCell, { flex: 0.8 }]}>{duration} day{duration !== 1 ? 's' : ''}</Text>
              <Text style={[styles.tableCell, { flex: 0.8 }]}>{block.current_status}</Text>
            </View>
          );
        })}
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text>Hotel Management System - Room Blocking Analysis</Text>
          <Text>This document is system generated</Text>
        </View>
        
        {/* Page Number */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};

export default RoomBlockingPDF;
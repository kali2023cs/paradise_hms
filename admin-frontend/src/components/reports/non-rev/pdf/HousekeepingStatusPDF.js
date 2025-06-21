import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { PDFStyles } from '../../PDFStyles';

const HousekeepingStatusPDF = ({ data }) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  // Calculate summary statistics
  const totalRooms = data.reportData.length;
  const cleanRooms = data.reportData.filter(r => r.cleaning_status === 'Clean').length;
  const dirtyRooms = data.reportData.filter(r => r.cleaning_status === 'Dirty').length;
  const inProgressRooms = data.reportData.filter(r => r.cleaning_status === 'In Progress').length;
  const inspectedRooms = data.reportData.filter(r => r.cleaning_status === 'Inspected').length;

  return (
    <Document>
      <Page size="A4" style={PDFStyles.page}>
        {/* Header with Hotel Info */}
        <View style={PDFStyles.headerContainer}>
          <View style={PDFStyles.hotelInfo}>
            <Text style={PDFStyles.hotelName}>{data.user?.property_name || ""}</Text>
            <Text style={PDFStyles.hotelAddress}>
              {data.user?.address || ""}
            </Text>
            <Text style={PDFStyles.hotelAddress}>
              {data.user?.city || ""}, {data.user?.state || "State"}, {data.user?.country || "Country"} - {data.user?.zip_code || "Code"}
            </Text>
            <Text style={PDFStyles.hotelContact}>
              Phone: {data.user?.contact_number || ""} | Email: {data.user?.email || ""}
            </Text>
          </View>
          
          <View style={PDFStyles.reportInfo}>
            <Text style={{ fontSize: 10, marginBottom: 5 }}>
              Generated On: {currentDate} at {currentTime}
            </Text>
          </View>
        </View>
        
        {/* Report Title */}
        <View style={PDFStyles.header}>
          <Text style={PDFStyles.title}>HOUSEKEEPING STATUS REPORT</Text>
          <Text style={PDFStyles.subtitle}>As of {data.reportDate}</Text>
        </View>
        
        {/* Report Metadata */}
        <View style={PDFStyles.reportMeta}>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Report Date:</Text>
            <Text style={PDFStyles.infoValue}>{data.reportDate}</Text>
          </View>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Filter:</Text>
            <Text style={PDFStyles.infoValue}>
              {data.filter.status}, {data.filter.cleaner}
            </Text>
          </View>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Total Rooms:</Text>
            <Text style={PDFStyles.infoValue}>{totalRooms}</Text>
          </View>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Prepared By:</Text>
            <Text style={PDFStyles.infoValue}>{data.user?.user_name || 'System Administrator'}</Text>
          </View>
        </View>
        
        {/* Summary Statistics */}
        <View style={[PDFStyles.reportMeta, { marginBottom: 15 }]}>
          <Text style={[PDFStyles.infoLabel, { marginBottom: 5, fontSize: 12 }]}>CLEANING SUMMARY:</Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Clean:</Text>
              <Text style={PDFStyles.infoValue}>{cleanRooms} ({(cleanRooms / totalRooms * 100).toFixed(1)}%)</Text>
            </View>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Dirty:</Text>
              <Text style={PDFStyles.infoValue}>{dirtyRooms} ({(dirtyRooms / totalRooms * 100).toFixed(1)}%)</Text>
            </View>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>In Progress:</Text>
              <Text style={PDFStyles.infoValue}>{inProgressRooms}</Text>
            </View>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Inspected:</Text>
              <Text style={PDFStyles.infoValue}>{inspectedRooms}</Text>
            </View>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Pending Cleaning:</Text>
              <Text style={PDFStyles.infoValue}>{dirtyRooms + inProgressRooms}</Text>
            </View>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Ready for Guests:</Text>
              <Text style={PDFStyles.infoValue}>{cleanRooms + inspectedRooms}</Text>
            </View>
          </View>
        </View>
        
        {/* Table Header */}
        <View style={[PDFStyles.table, PDFStyles.tableRow, PDFStyles.tableHeader]}>
          <Text style={[PDFStyles.tableCell, { flex: 0.8 }]}>Room No</Text>
          <Text style={[PDFStyles.tableCell, { flex: 1 }]}>Block/Floor</Text>
          <Text style={[PDFStyles.tableCell, { flex: 1 }]}>Type</Text>
          <Text style={[PDFStyles.tableCell, { flex: 1 }]}>Status</Text>
          <Text style={[PDFStyles.tableCell, { flex: 1 }]}>Cleaner</Text>
          <Text style={[PDFStyles.tableCell, { flex: 1 }]}>Time Taken</Text>
          <Text style={[PDFStyles.tableCell, { flex: 1.5 }]}>Remarks</Text>
        </View>
        
        {/* Table Rows */}
        {data.reportData.map((room, index) => (
          <View key={index} style={[PDFStyles.tableRow, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }]}>
            <Text style={[PDFStyles.tableCell, { flex: 0.8 }]}>{room.room_no}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 1 }]}>{room.block_name}/{room.floor_name}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 1 }]}>{room.room_type_name}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 1 }]}>{room.cleaning_status}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 1 }]}>{room.cleaner_name || 'N/A'}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 1 }]}>{room.time_taken || 'N/A'}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 1.5 }]}>{room.remarks || 'N/A'}</Text>
          </View>
        ))}
        
        {/* Notes Section */}
        <View style={PDFStyles.noteSection}>
          <Text style={PDFStyles.noteTitle}>HOUSEKEEPING NOTES:</Text>
          <Text>
            1. Rooms marked as "Clean" are ready for guest check-in.
          </Text>
          <Text>
            2. "Dirty" rooms require immediate attention.
          </Text>
          <Text>
            3. Report generated on {currentDate} at {currentTime}.
          </Text>
        </View>
        
        {/* Footer */}
        <View style={PDFStyles.footer}>
          <Text>{data.user?.property_name || ""} - Housekeeping Status Report</Text>
          <Text>This document is system generated</Text>
        </View>
        
        {/* Page Number */}
        <Text style={PDFStyles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};

export default HousekeepingStatusPDF;
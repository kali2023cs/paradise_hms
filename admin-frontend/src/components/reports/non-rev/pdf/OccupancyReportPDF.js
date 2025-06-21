import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { PDFStyles } from '../../PDFStyles';

const OccupancyReportPDF = ({ data }) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  
  // Calculate summary statistics
  const totalRooms = data.reportData.length;
  const occupiedRooms = data.reportData.filter(r => r.room_status === 'Occupied').length;
  const vacantRooms = data.reportData.filter(r => r.room_status === 'Vacant').length;
  const blockedRooms = data.reportData.filter(r => r.room_status === 'Blocked').length;
  const maintenanceRooms = data.reportData.filter(r => r.room_status === 'Maintenance').length;
  const dirtyRooms = data.reportData.filter(r => r.cleaning_status === 'Dirty').length;
  
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  
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
          <Text style={PDFStyles.title}>ROOM OCCUPANCY REPORT</Text>
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
              {data.filter.block}, {data.filter.floor}
            </Text>
          </View>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Total Rooms:</Text>
            <Text style={PDFStyles.infoValue}>{totalRooms}</Text>
          </View>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Occupancy Rate:</Text>
            <Text style={PDFStyles.infoValue}>{occupancyRate}%</Text>
          </View>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Prepared By:</Text>
            <Text style={PDFStyles.infoValue}>{data.user?.user_name || 'System Administrator'}</Text>
          </View>
        </View>
        
        {/* Summary Statistics */}
        <View style={[PDFStyles.reportMeta, { marginBottom: 15 }]}>
          <Text style={[PDFStyles.infoLabel, { marginBottom: 5, fontSize: 12 }]}>SUMMARY STATISTICS:</Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Occupied:</Text>
              <Text style={PDFStyles.infoValue}>{occupiedRooms} ({occupancyRate}%)</Text>
            </View>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Vacant:</Text>
              <Text style={PDFStyles.infoValue}>{vacantRooms}</Text>
            </View>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Blocked:</Text>
              <Text style={PDFStyles.infoValue}>{blockedRooms}</Text>
            </View>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Maintenance:</Text>
              <Text style={PDFStyles.infoValue}>{maintenanceRooms}</Text>
            </View>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Dirty Rooms:</Text>
              <Text style={PDFStyles.infoValue}>{dirtyRooms}</Text>
            </View>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Available:</Text>
              <Text style={PDFStyles.infoValue}>{vacantRooms - dirtyRooms} (Clean & Vacant)</Text>
            </View>
          </View>
        </View>
        
        {/* Table Header */}
        <View style={[PDFStyles.table, PDFStyles.tableRow, PDFStyles.tableHeader]}>
          <Text style={[PDFStyles.tableCell, { flex: 0.8 }]}>Room No</Text>
          <Text style={[PDFStyles.tableCell, { flex: 1 }]}>Block/Floor</Text>
          <Text style={[PDFStyles.tableCell, { flex: 1 }]}>Type</Text>
          <Text style={[PDFStyles.tableCell, { flex: 0.8 }]}>Status</Text>
          <Text style={[PDFStyles.tableCell, { flex: 0.8 }]}>Cleaning</Text>
          <Text style={[PDFStyles.tableCell, { flex: 1 }]}>Maintenance</Text>
          <Text style={[PDFStyles.tableCell, { flex: 1.5 }]}>Guest/Reason</Text>
          <Text style={[PDFStyles.tableCell, { flex: 1.2 }]}>Check-In/Out</Text>
        </View>
        
        {/* Table Rows */}
        {data.reportData.map((room, index) => (
          <View key={index} style={[PDFStyles.tableRow, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }]}>
            <Text style={[PDFStyles.tableCell, { flex: 0.8 }]}>{room.room_no}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 1 }]}>{room.block_name}/{room.floor_name}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 1 }]}>{room.room_type_name}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 0.8 }]}>{room.room_status}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 0.8 }]}>{room.cleaning_status || 'N/A'}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 1 }]}>{room.maintenance_status || 'N/A'}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 1.5 }]}>
              {room.guest_name || room.block_reason || 'N/A'}
              {room.guest_contact && ` (${room.guest_contact})`}
            </Text>
            <Text style={[PDFStyles.tableCell, { flex: 1.2 }]}>
              {room.check_in_date && (
                <Text>
                  In: {room.check_in_date}{'\n'}
                  {room.check_out_date && `Out: ${room.check_out_date}`}
                </Text>
              )}
            </Text>
          </View>
        ))}
        
        {/* Notes Section */}
        <View style={PDFStyles.noteSection}>
          <Text style={PDFStyles.noteTitle}>NOTES:</Text>
          <Text>
            1. Occupancy Rate = (Occupied Rooms / Total Rooms) * 100
          </Text>
          <Text>
            2. Available Rooms = Vacant Rooms that are Clean
          </Text>
          <Text>
            3. Report generated on {currentDate} at {currentTime}
          </Text>
        </View>
        
        {/* Footer */}
        <View style={PDFStyles.footer}>
          <Text>{data.user?.property_name || ""} - Occupancy Report</Text>
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

export default OccupancyReportPDF;
import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { PDFStyles } from '../../PDFStyles';

const RoomsReportPDF = ({ data }) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <Document>
      <Page size="A4" style={PDFStyles.page}>
        {/* Watermark */}
        <Text style={PDFStyles.watermark}>INTERNAL USE</Text>
        
        {/* Header with Hotel Info */}
        <View style={PDFStyles.headerContainer}>
          <View style={PDFStyles.hotelInfo}>
            <Text style={PDFStyles.hotelName}>{data.user?.property_name || "Hotel Name"}</Text>
            <Text style={PDFStyles.hotelAddress}>
              {data.user?.address || "Address Line 1"}
            </Text>
            <Text style={PDFStyles.hotelAddress}>
              {data.user?.city || "City"}, {data.user?.state || "State"}, {data.user?.country || "Country"} - {data.user?.zip_code || "ZIP"}
            </Text>
            <Text style={PDFStyles.hotelContact}>
              Phone: {data.user?.contact_number || "Phone"} | Email: {data.user?.email || "Email"}
            </Text>
          </View>
          
          <View style={PDFStyles.reportInfo}>
            <Text style={{ fontSize: 10 }}>
              Generated On: {currentDate} at {currentTime}
            </Text>
          </View>
        </View>
        
        {/* Report Title */}
        <View style={PDFStyles.header}>
          <Text style={PDFStyles.title}>CURRENT ROOMS STATUS REPORT</Text>
          <Text style={PDFStyles.subtitle}>As of {currentDate}</Text>
        </View>
        
        {/* Report Metadata */}
        <View style={PDFStyles.reportMeta}>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Generated By:</Text>
            <Text style={PDFStyles.infoValue}>{data.user?.user_name || 'System Administrator'}</Text>
          </View>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Total Rooms:</Text>
            <Text style={PDFStyles.infoValue}>{data.reportData.length}</Text>
          </View>
        </View>

        {/* Summary Section if available */}
        {data.summary && (
          <View style={[PDFStyles.reportMeta, { marginBottom: 15 }]}>
            <Text style={{ fontWeight: 'bold', marginBottom: 8, color: '#1976d2' }}>SUMMARY</Text>
            {Object.entries(data.summary).map(([key, value]) => (
              <View key={key} style={PDFStyles.infoRow}>
                <Text style={[PDFStyles.infoLabel, { textTransform: 'capitalize' }]}>{key.replace(/_/g, ' ')}:</Text>
                <Text style={PDFStyles.infoValue}>{value}</Text>
              </View>
            ))}
          </View>
        )}
        
        {/* Table */}
        <View style={PDFStyles.table}>
          {/* Table Header */}
          <View style={[PDFStyles.tableRow, PDFStyles.tableHeader]}>
            <Text style={[PDFStyles.tableCell, { flex: 0.8 }]}>Room No</Text>
            <Text style={[PDFStyles.tableCell, { flex: 1.2 }]}>Room Type</Text>
            <Text style={PDFStyles.tableCell}>Floor</Text>
            <Text style={PDFStyles.tableCell}>Status</Text>
            <Text style={PDFStyles.tableCell}>Max Pax</Text>
            <Text style={PDFStyles.tableCell}>Extra Pax</Text>
            <Text style={PDFStyles.tableCell}>Active</Text>
          </View>
          
          {/* Table Rows */}
          {data.reportData.map((room, index) => (
            <View 
              key={index} 
              style={[
                PDFStyles.tableRow,
                { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f8f8' }
              ]}
            >
              <Text style={[PDFStyles.tableCell, { flex: 0.8 }]}>{room.room_no}</Text>
              <Text style={[PDFStyles.tableCell, { flex: 1.2 }]}>{room.room_type_name || 'N/A'}</Text>
              <Text style={PDFStyles.tableCell}>{room.floor_name || 'N/A'}</Text>
              <Text style={PDFStyles.tableCell}>{room.status_name || 'N/A'}</Text>
              <Text style={PDFStyles.tableCell}>{room.max_pax || 'N/A'}</Text>
              <Text style={PDFStyles.tableCell}>{room.max_extra_pax || 'N/A'}</Text>
              <Text style={PDFStyles.tableCell}>{room.is_active ? 'Yes' : 'No'}</Text>
            </View>
          ))}
        </View>
        
        {/* Notes Section */}
        <View style={PDFStyles.noteSection}>
          <Text style={PDFStyles.noteTitle}>REPORT NOTES:</Text>
          <Text>
            1. This report provides current status of all rooms as of {currentDate}.
          </Text>
          <Text>
            2. Data is accurate based on system records at the time of generation.
          </Text>
          <Text>
            3. Report generated on {currentDate} at {currentTime}.
          </Text>
        </View>
        
        {/* Signature Area */}
        <View style={PDFStyles.signature}>
          <View style={PDFStyles.signatureLine}>
            <Text>Prepared By: _________________</Text>
          </View>
          <View style={PDFStyles.signatureLine}>
            <Text>Approved By: _________________</Text>
          </View>
        </View>
        
        {/* Footer */}
        <Text style={PDFStyles.footer}>
          {data.user?.property_name || "Hotel Name"} - Rooms Status Report | 
          This document is system generated and requires official stamp/signature for validation
        </Text>
        
        {/* Page Number */}
        <Text style={PDFStyles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};

export default RoomsReportPDF;
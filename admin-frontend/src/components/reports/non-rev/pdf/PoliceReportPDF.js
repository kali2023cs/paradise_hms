import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { PDFStyles } from '../../PDFStyles';

const PoliceReportPDF = ({ data }) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  
  return (
    <Document>
      <Page size="A4" style={PDFStyles.page}>
        {/* Watermark */}
        <Text style={PDFStyles.watermark}>CONFIDENTIAL</Text>
        
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
          <Text style={PDFStyles.title}>OFFICIAL POLICE REPORT</Text>
          <Text style={PDFStyles.subtitle}>Confidential - For Official Use Only</Text>
        </View>
        
        {/* Report Metadata */}
        <View style={PDFStyles.reportMeta}>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Report Date:</Text>
            <Text style={PDFStyles.infoValue}>{currentDate}</Text>
          </View>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Period:</Text>
            <Text style={PDFStyles.infoValue}>{data.fromDate} to {data.toDate}</Text>
          </View>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Purpose:</Text>
            <Text style={PDFStyles.infoValue}>{data.purpose}</Text>
          </View>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Report Type:</Text>
            <Text style={PDFStyles.infoValue}>
              {data.reportType === 'checkin' ? 'Check-in Records' : 'Check-out Records'}
            </Text>
          </View>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Total Records:</Text>
            <Text style={PDFStyles.infoValue}>{data.reportData.length}</Text>
          </View>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Prepared By:</Text>
            <Text style={PDFStyles.infoValue}>{data.user?.user_name || 'System Administrator'}</Text>
          </View>
        </View>
        
        {/* Table Header */}
        <View style={[PDFStyles.table, PDFStyles.tableRow, PDFStyles.tableHeader]}>
          <Text style={[PDFStyles.tableCell, { flex: 1.5 }]}>Guest Name</Text>
          <Text style={PDFStyles.tableCell}>Contact</Text>
          <Text style={PDFStyles.tableCell}>Room No</Text>
          <Text style={PDFStyles.tableCell}>Male</Text>
          <Text style={PDFStyles.tableCell}>Female</Text>
          <Text style={PDFStyles.tableCell}>Extra</Text>
          <Text style={PDFStyles.tableCell}>Arrival Mode</Text>
          <Text style={[PDFStyles.tableCell, { flex: 1.2 }]}>Check-In</Text>
          <Text style={[PDFStyles.tableCell, { flex: 1.2 }]}>
            {data.reportType === 'checkin' ? 'Expected Check-Out' : 'Actual Check-Out'}
          </Text>
          {data.reportType === 'checkout' && (
            <Text style={[PDFStyles.tableCell, { flex: 1.2 }]}>Late/Early Checkout</Text>
          )}
        </View>
        
        {/* Table Rows */}
        {data.reportData.map((record, index) => (
          <View key={index} style={[PDFStyles.tableRow, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }]}>
            <Text style={[PDFStyles.tableCell, { flex: 1.5 }]}>
              {record.guest_name.trim()}
            </Text>
            <Text style={PDFStyles.tableCell}>{record.contact_no || 'N/A'}</Text>
            <Text style={PDFStyles.tableCell}>{record.room_no || 'N/A'}</Text>
            <Text style={PDFStyles.tableCell}>{record.male || 'N/A'}</Text>
            <Text style={PDFStyles.tableCell}>{record.female || 'N/A'}</Text>
            <Text style={PDFStyles.tableCell}>{record.extra || 'N/A'}</Text>
            <Text style={PDFStyles.tableCell}>{record.mode_name || 'N/A'}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 1.2 }]}>
              {record.check_in_datetime ? 
                new Date(record.check_in_datetime).toLocaleString() : 'N/A'}
            </Text>
            <Text style={[PDFStyles.tableCell, { flex: 1.2 }]}>
              {data.reportType === 'checkin' ? 
                (record.check_out_datetime ? new Date(record.check_out_datetime).toLocaleString() : 'N/A') :
                (record.actual_checkout_datetime ? new Date(record.actual_checkout_datetime).toLocaleString() : 'N/A')}
            </Text>
            {data.reportType === 'checkout' && (
              <Text style={[PDFStyles.tableCell, { flex: 1.2 }]}>
                {record.late_checkout == 1 ? 'Late' : 
                  record.early_checkout == 1 ? 'Early' : 'On Time'}
              </Text>
            )}
          </View>
        ))}
        
        {/* Notes Section */}
        <View style={PDFStyles.noteSection}>
          <Text style={PDFStyles.noteTitle}>IMPORTANT NOTES:</Text>
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
        <View style={PDFStyles.signature}>
          <View style={PDFStyles.signatureLine}>
            <Text>Prepared By: {data.preparedBy || '_________________'}</Text>
          </View>
          <View style={PDFStyles.signatureLine}>
            <Text>Authorized Signature: _________________</Text>
          </View>
        </View>
        
        {/* Footer */}
        <View style={PDFStyles.footer}>
          <Text>{data.user?.property_name || ""} - Police Report</Text>
          <Text>This document is system generated and requires official stamp/signature for validation</Text>
        </View>
        
        {/* Page Number */}
        <Text style={PDFStyles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};

export default PoliceReportPDF;
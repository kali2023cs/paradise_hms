import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { PDFStyles } from '../../PDFStyles';

const MaintenanceTrackingPDF = ({ data }) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  // Calculate statistics
  const totalIssues = data.reportData.length;
  const resolvedIssues = data.reportData.filter(i => i.status === 'Resolved').length;
  const unresolvedIssues = totalIssues - resolvedIssues;
  const avgResolutionTime = calculateAvgResolutionTime(data.reportData);

  function calculateAvgResolutionTime(issues) {
    const resolved = issues.filter(i => i.time_taken_hours);
    if (resolved.length === 0) return 'N/A';
    
    const totalHours = resolved.reduce((sum, issue) => sum + issue.time_taken_hours, 0);
    const avgHours = totalHours / resolved.length;
    
    if (avgHours < 1) return '<1 hour';
    if (avgHours < 24) return `${Math.round(avgHours)} hours`;
    return `${Math.round(avgHours / 24)} days`;
  }

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
          <Text style={PDFStyles.title}>MAINTENANCE TRACKING REPORT</Text>
          <Text style={PDFStyles.subtitle}>
            {data.fromDate} to {data.toDate}
          </Text>
        </View>
        
        {/* Report Metadata */}
        <View style={PDFStyles.reportMeta}>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Report Period:</Text>
            <Text style={PDFStyles.infoValue}>{data.fromDate} to {data.toDate}</Text>
          </View>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Filters:</Text>
            <Text style={PDFStyles.infoValue}>
              {data.filter.status}, {data.filter.priority}, {data.filter.type}
            </Text>
          </View>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Total Issues:</Text>
            <Text style={PDFStyles.infoValue}>{totalIssues}</Text>
          </View>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Resolved:</Text>
            <Text style={PDFStyles.infoValue}>{resolvedIssues} ({(resolvedIssues / totalIssues * 100).toFixed(1)}%)</Text>
          </View>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Avg Resolution:</Text>
            <Text style={PDFStyles.infoValue}>{avgResolutionTime}</Text>
          </View>
          <View style={PDFStyles.infoRow}>
            <Text style={PDFStyles.infoLabel}>Prepared By:</Text>
            <Text style={PDFStyles.infoValue}>{data.user?.user_name || 'System Administrator'}</Text>
          </View>
        </View>
        
        {/* Priority Breakdown */}
        <View style={[PDFStyles.reportMeta, { marginBottom: 15 }]}>
          <Text style={[PDFStyles.infoLabel, { marginBottom: 5, fontSize: 12 }]}>PRIORITY BREAKDOWN:</Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Emergency:</Text>
              <Text style={PDFStyles.infoValue}>
                {data.reportData.filter(i => i.priority === 'Emergency').length}
              </Text>
            </View>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>High:</Text>
              <Text style={PDFStyles.infoValue}>
                {data.reportData.filter(i => i.priority === 'High').length}
              </Text>
            </View>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Medium:</Text>
              <Text style={PDFStyles.infoValue}>
                {data.reportData.filter(i => i.priority === 'Medium').length}
              </Text>
            </View>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Low:</Text>
              <Text style={PDFStyles.infoValue}>
                {data.reportData.filter(i => i.priority === 'Low').length}
              </Text>
            </View>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Unassigned:</Text>
              <Text style={PDFStyles.infoValue}>
                {data.reportData.filter(i => !i.technician || i.technician === 'Unassigned').length}
              </Text>
            </View>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Overdue:</Text>
              <Text style={PDFStyles.infoValue}>
                {data.reportData.filter(i => i.time_taken && i.time_taken.includes('Overdue')).length}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Table Header */}
        <View style={[PDFStyles.table, PDFStyles.tableRow, PDFStyles.tableHeader]}>
          <Text style={[PDFStyles.tableCell, { flex: 0.8 }]}>Room No</Text>
          <Text style={[PDFStyles.tableCell, { flex: 1 }]}>Issue Type</Text>
          <Text style={[PDFStyles.tableCell, { flex: 0.8 }]}>Priority</Text>
          <Text style={[PDFStyles.tableCell, { flex: 0.8 }]}>Status</Text>
          <Text style={[PDFStyles.tableCell, { flex: 1 }]}>Reported By</Text>
          <Text style={[PDFStyles.tableCell, { flex: 1 }]}>Reported On</Text>
          <Text style={[PDFStyles.tableCell, { flex: 1 }]}>Technician</Text>
          <Text style={[PDFStyles.tableCell, { flex: 1 }]}>Time Taken</Text>
        </View>
        
        {/* Table Rows */}
        {data.reportData.map((issue, index) => (
          <View key={index} style={[PDFStyles.tableRow, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }]}>
            <Text style={[PDFStyles.tableCell, { flex: 0.8 }]}>{issue.room_no}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 1 }]}>{issue.issue_type}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 0.8 }]}>{issue.priority}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 0.8 }]}>{issue.status}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 1 }]}>{issue.reported_by}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 1 }]}>{issue.reported_date}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 1 }]}>{issue.technician || 'Unassigned'}</Text>
            <Text style={[PDFStyles.tableCell, { flex: 1 }]}>{issue.time_taken || 'N/A'}</Text>
          </View>
        ))}
        
        {/* Notes Section */}
        <View style={PDFStyles.noteSection}>
          <Text style={PDFStyles.noteTitle}>MAINTENANCE NOTES:</Text>
          <Text>
            1. Emergency issues should be resolved within 2 hours.
          </Text>
          <Text>
            2. High priority issues should be resolved within 24 hours.
          </Text>
          <Text>
            3. Report generated on {currentDate} at {currentTime}.
          </Text>
        </View>
        
        {/* Signature Area */}
        <View style={PDFStyles.signature}>
          <View style={PDFStyles.signatureLine}>
            <Text>Maintenance Manager: _________________</Text>
          </View>
          <View style={PDFStyles.signatureLine}>
            <Text>Date: _________________</Text>
          </View>
        </View>
        
        {/* Footer */}
        <View style={PDFStyles.footer}>
          <Text>{data.user?.property_name || ""} - Maintenance Tracking Report</Text>
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

export default MaintenanceTrackingPDF;
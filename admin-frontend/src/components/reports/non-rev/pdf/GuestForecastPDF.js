import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { PDFStyles } from '../../PDFStyles';

const GuestForecastPDF = ({ data }) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  const endDate = new Date(data.reportDate);
  endDate.setDate(endDate.getDate() + data.forecastDays - 1);

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
          <Text style={PDFStyles.title}>GUEST MOVEMENT FORECAST REPORT</Text>
          <Text style={PDFStyles.subtitle}>
            {data.reportDate} to {endDate.toISOString().split('T')[0]}
          </Text>
        </View>
        
        {/* Summary Statistics */}
        <View style={[PDFStyles.reportMeta, { marginBottom: 15 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Total Arrivals:</Text>
              <Text style={[PDFStyles.infoValue, { fontSize: 14 }]}>{data.summary.total_arrivals}</Text>
            </View>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Total Departures:</Text>
              <Text style={[PDFStyles.infoValue, { fontSize: 14 }]}>{data.summary.total_departures}</Text>
            </View>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>VIP Guests:</Text>
              <Text style={[PDFStyles.infoValue, { fontSize: 14 }]}>{data.summary.vip_count}</Text>
            </View>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Peak Arrival Hour:</Text>
              <Text style={[PDFStyles.infoValue, { fontSize: 14 }]}>{data.summary.peak_arrival_hour}</Text>
            </View>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Peak Departure Hour:</Text>
              <Text style={[PDFStyles.infoValue, { fontSize: 14 }]}>{data.summary.peak_departure_hour}</Text>
            </View>
            <View style={{ width: '30%' }}>
              <Text style={PDFStyles.infoLabel}>Special Requests:</Text>
              <Text style={[PDFStyles.infoValue, { fontSize: 14 }]}>{data.summary.special_requests_count}</Text>
            </View>
          </View>
        </View>
        
        {/* Daily Forecasts */}
        {data.forecastData.map((dayData, dayIndex) => (
          <View key={dayIndex} style={{ marginBottom: 15 }} break={dayIndex > 0}>
            {/* Day Header */}
            <View style={{ 
              backgroundColor: '#1976d2',
              padding: 5,
              marginBottom: 5,
              borderRadius: 3
            }}>
              <Text style={{ 
                color: 'white',
                fontSize: 12,
                fontWeight: 'bold'
              }}>
                {dayData.date} - {dayData.day_of_week}
              </Text>
            </View>
            
            {/* Arrivals Table */}
            <Text style={{ 
              fontSize: 10,
              marginBottom: 3,
              fontWeight: 'bold'
            }}>
              Arrivals ({dayData.arrivals.length})
            </Text>
            
            <View style={[PDFStyles.table, { marginBottom: 10 }]}>
              {/* Table Header */}
              <View style={[PDFStyles.tableRow, { 
                backgroundColor: '#1976d2',
                color: 'white',
                fontWeight: 'bold'
              }]}>
                <Text style={[PDFStyles.tableCell, { flex: 1 }]}>Time</Text>
                <Text style={[PDFStyles.tableCell, { flex: 2 }]}>Guest</Text>
                <Text style={[PDFStyles.tableCell, { flex: 1 }]}>Room</Text>
                <Text style={[PDFStyles.tableCell, { flex: 1.5 }]}>Segment</Text>
                <Text style={[PDFStyles.tableCell, { flex: 2 }]}>Requests</Text>
              </View>
              
              {/* Table Rows */}
              {dayData.arrivals.map((arrival, index) => (
                <View key={index} style={[
                  PDFStyles.tableRow,
                  { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }
                ]}>
                  <Text style={[PDFStyles.tableCell, { flex: 1, fontSize: 8 }]}>
                    {arrival.expected_time || 'N/A'}
                  </Text>
                  <Text style={[PDFStyles.tableCell, { flex: 2, fontSize: 8 }]}>
                    {arrival.guest_name}
                    {arrival.is_vip && (
                      <Text style={{ color: '#d32f2f', fontSize: 8 }}> (VIP)</Text>
                    )}
                  </Text>
                  <Text style={[PDFStyles.tableCell, { flex: 1, fontSize: 8 }]}>
                    {arrival.room_number}
                  </Text>
                  <Text style={[PDFStyles.tableCell, { flex: 1.5, fontSize: 8 }]}>
                    {arrival.segment}
                  </Text>
                  <Text style={[PDFStyles.tableCell, { flex: 2, fontSize: 8 }]}>
                    {arrival.special_requests || 'None'}
                  </Text>
                </View>
              ))}
            </View>
            
            {/* Departures Table */}
            <Text style={{ 
              fontSize: 10,
              marginBottom: 3,
              fontWeight: 'bold'
            }}>
              Departures ({dayData.departures.length})
            </Text>
            
            <View style={PDFStyles.table}>
              {/* Table Header */}
              <View style={[PDFStyles.tableRow, { 
                backgroundColor: '#1976d2',
                color: 'white',
                fontWeight: 'bold'
              }]}>
                <Text style={[PDFStyles.tableCell, { flex: 1 }]}>Time</Text>
                <Text style={[PDFStyles.tableCell, { flex: 2 }]}>Guest</Text>
                <Text style={[PDFStyles.tableCell, { flex: 1 }]}>Room</Text>
                <Text style={[PDFStyles.tableCell, { flex: 1.5 }]}>Check-Out</Text>
                <Text style={[PDFStyles.tableCell, { flex: 1.5 }]}>Late Checkout</Text>
              </View>
              
              {/* Table Rows */}
              {dayData.departures.map((departure, index) => (
                <View key={index} style={[
                  PDFStyles.tableRow,
                  { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }
                ]}>
                  <Text style={[PDFStyles.tableCell, { flex: 1, fontSize: 8 }]}>
                    {departure.expected_time || 'N/A'}
                  </Text>
                  <Text style={[PDFStyles.tableCell, { flex: 2, fontSize: 8 }]}>
                    {departure.guest_name}
                    {departure.is_vip && (
                      <Text style={{ color: '#d32f2f', fontSize: 8 }}> (VIP)</Text>
                    )}
                  </Text>
                  <Text style={[PDFStyles.tableCell, { flex: 1, fontSize: 8 }]}>
                    {departure.room_number}
                  </Text>
                  <Text style={[PDFStyles.tableCell, { flex: 1.5, fontSize: 8 }]}>
                    {departure.checkout_type === 'Early' ? (
                      <Text style={{ color: '#ff9800' }}>Early</Text>
                    ) : (
                      <Text style={{ color: '#4caf50' }}>On Time</Text>
                    )}
                  </Text>
                  <Text style={[PDFStyles.tableCell, { flex: 1.5, fontSize: 8 }]}>
                    {departure.late_checkout_approved ? (
                      <Text style={{ color: '#2196f3' }}>Until {departure.late_checkout_time}</Text>
                    ) : (
                      'No'
                    )}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
        
        {/* Notes Section */}
        <View style={PDFStyles.noteSection}>
          <Text style={PDFStyles.noteTitle}>FORECAST NOTES:</Text>
          <Text>
            1. Forecast is based on current reservations and expected check-in/check-out times.
          </Text>
          <Text>
            2. Walk-ins and last-minute changes are not reflected in this report.
          </Text>
          <Text>
            3. Report generated on {currentDate} at {currentTime}.
          </Text>
        </View>
        
        {/* Footer */}
        <View style={PDFStyles.footer}>
          <Text>{data.user?.property_name || ""} - Guest Movement Forecast</Text>
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

export default GuestForecastPDF;
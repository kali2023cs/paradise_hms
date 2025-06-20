import { StyleSheet } from '@react-pdf/renderer';

export const PDFStyles = StyleSheet.create({
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
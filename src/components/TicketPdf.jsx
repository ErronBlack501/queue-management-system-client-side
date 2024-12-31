import React from 'react'
import {
    Document,
    Page,
    View,
    Text,
    Image,
    StyleSheet,
} from '@react-pdf/renderer'
import dayjs from 'dayjs'

// Styles
const styles = StyleSheet.create({
    page: {
        padding: 10,
        fontFamily: 'Helvetica',
    },
    logo: {
        width: 100,
        height: 36,
        marginBottom: 10,
        alignSelf: 'center',
    },
    section: {
        marginBottom: 10,
        textAlign: 'center',
    },
    ticketInfo: {
        marginBottom: 15,
        fontSize: 10,
    },
    footer: {
        fontSize: 8,
        marginTop: 20,
        textAlign: 'center',
    },
})

const TicketPDF = ({ ticket, ticketsBefore }) => (
    <Document>
        <Page size="A7" style={styles.page}>
            <Image style={styles.logo} src="/smmc.png" />

            <View style={styles.section}>
                <Text style={styles.ticketInfo}>
                    <Text>Ticket Number: </Text>
                    <Text>{ticket.ticketNumber}</Text>
                </Text>
                <Text style={styles.ticketInfo}>
                    Service: {ticket.service.serviceName}
                </Text>
                <Text style={styles.ticketInfo}>
                    Date:{' '}
                    {dayjs(ticket.createdAt).format('DD MMM YYYY HH:mm:ss')}
                </Text>
                <Text style={styles.ticketInfo}>
                    Tickets Before You: {ticketsBefore}
                </Text>
                <Text style={styles.ticketInfo}>
                    Please proceed to counter: {ticket.counter.counterNumber}
                </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text>Thank you for using our service!</Text>
            </View>
        </Page>
    </Document>
)

export default TicketPDF

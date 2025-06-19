<!DOCTYPE html>
<html>
<head>
    <title>Invoice #{{ $invoice->invoice_number }}</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { text-align: center; margin-bottom: 20px; }
        .invoice-number { font-size: 24px; font-weight: bold; }
        .details { margin-bottom: 30px; }
        .from-to { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table th { background-color: #f2f2f2; }
        .totals { float: right; width: 300px; }
        .totals-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Hotel Name</h1>
        <p>Hotel Address, City, State, ZIP</p>
        <p>GSTIN: XXXXXXXX</p>
        <div class="invoice-number">INVOICE #{{ $invoice->invoice_number }}</div>
    </div>

    <div class="details">
        <div class="from-to">
            <div>
                <strong>From:</strong><br>
                Hotel Name<br>
                Hotel Address<br>
                City, State, ZIP<br>
                GSTIN: XXXXXXXX
            </div>
            <div>
                <strong>To:</strong><br>
                {{ $invoice->checkout->checkin->first_name }} {{ $invoice->checkout->checkin->last_name }}<br>
                {{ $invoice->checkout->checkin->address }}<br>
                {{ $invoice->checkout->checkin->city }}, {{ $invoice->checkout->checkin->pin_code }}<br>
                @if($invoice->checkout->checkin->gst_number)
                GSTIN: {{ $invoice->checkout->checkin->gst_number }}
                @endif
            </div>
        </div>

        <div>
            <strong>Invoice Date:</strong> {{ date('d/m/Y', strtotime($invoice->invoice_date)) }}<br>
            <strong>Due Date:</strong> {{ date('d/m/Y', strtotime($invoice->due_date)) }}<br>
            <strong>Status:</strong> {{ $invoice->status }}
        </div>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Tax</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $item)
            <tr>
                <td>{{ $item->description }}</td>
                <td>{{ $item->quantity }}</td>
                <td>₹{{ number_format($item->unit_price, 2) }}</td>
                <td>{{ $item->tax_rate }}%</td>
                <td>₹{{ number_format($item->amount, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <div class="totals-row">
            <span>Subtotal:</span>
            <span>₹{{ number_format($subtotal, 2) }}</span>
        </div>
        <div class="totals-row">
            <span>Tax:</span>
            <span>₹{{ number_format($taxAmount, 2) }}</span>
        </div>
        <div class="totals-row" style="font-weight: bold; border-top: 1px solid #000; padding-top: 5px;">
            <span>Total:</span>
            <span>₹{{ number_format($total, 2) }}</span>
        </div>
        <div class="totals-row">
            <span>Amount Paid:</span>
            <span>₹{{ number_format($invoice->checkout->amount_paid, 2) }}</span>
        </div>
        <div class="totals-row" style="font-weight: bold;">
            <span>Balance Due:</span>
            <span>₹{{ number_format($invoice->checkout->balance_due, 2) }}</span>
        </div>
    </div>

    <div class="footer">
        <p>Thank you for your business!</p>
        <p>Payment is due within 7 days. Please make checks payable to Hotel Name.</p>
        <p>If you have any questions about this invoice, please contact our accounting department.</p>
    </div>
</body>
</html>
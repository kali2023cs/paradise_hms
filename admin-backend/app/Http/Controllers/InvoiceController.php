<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use PDF;

class InvoiceController extends Controller
{
    public function getInvoiceList(Request $request)
    {
        try {
            $perPage = $request->per_page ?? 10;
            $invoices = Invoice::with(['checkout.checkin.rooms.roomType', 'checkout.checkin.rooms.room'])
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $invoices,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving invoice list: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getInvoiceDetails($invoiceNumber)
    {
        try {
            $invoice = Invoice::with([
                'checkout.checkin.rooms.roomType',
                'checkout.checkin.rooms.room',
                'checkout.payments',
                'items'
            ])->where('invoice_number', $invoiceNumber)->firstOrFail();

            return response()->json([
                'success' => true,
                'data' => $invoice,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving invoice details: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function generatePdf($invoiceNumber)
    {
        try {
            $invoice = Invoice::with([
                'checkout.checkin.rooms.roomType',
                'checkout.checkin.rooms.room',
                'checkout.payments',
                'items'
            ])->where('invoice_number', $invoiceNumber)->firstOrFail();

            // Calculate totals
            $subtotal = $invoice->subtotal ?? $invoice->items->sum('amount');
            $taxAmount = $invoice->tax_amount ?? $invoice->items->sum(function($item) {
                return ($item->amount * $item->tax_rate) / 100;
            });
            $discountAmount = $invoice->discount_amount ?? ($invoice->checkout->discount_amount ?? 0);
            $total = $invoice->total_amount ?? ($subtotal + $taxAmount - $discountAmount);
            $amountPaid = $invoice->amount_paid ?? ($invoice->checkout->amount_paid ?? 0);
            $balanceDue = $invoice->balance_due ?? ($invoice->checkout->balance_due ?? 0);

            return response()->json([
                'success' => true,
                'data' => [
                    'invoice' => $invoice,
                    'subtotal' => $subtotal,
                    'taxAmount' => $taxAmount,
                    'discountAmount' => $discountAmount,
                    'total' => $total,
                    'amountPaid' => $amountPaid,
                    'balanceDue' => $balanceDue,
                    'date' => now()->format('d/m/Y'),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error generating PDF: ' . $e->getMessage(),
            ], 500);
        }
    }
}
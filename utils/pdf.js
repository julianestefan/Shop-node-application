"use Strict";
const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

module.exports = (res, order) => {
    const pdfDoc = new PDFDocument();

    const invoiceName = 'invoice-' + order._id.toString() + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
    );

    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text('Invoice', {
        underline: true
    });
    pdfDoc.text('-----------------------');
    let totalPrice = 0;
    order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
            .fontSize(14)
            .text(
                prod.product.title +
                ' - ' +
                prod.quantity +
                ' x ' +
                '$' +
                prod.product.price
            );
    });
    pdfDoc.text('---');
    pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

    pdfDoc.end();
}
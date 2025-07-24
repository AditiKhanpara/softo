const PdfPrinter = require("pdfmake");

const fonts = {
  Courier: {
    normal: "Courier",
    bold: "Courier-Bold",
    italics: "Courier-Oblique",
    bolditalics: "Courier-BoldOblique",
  },
};

const printer = new PdfPrinter(fonts);

function generateQuotationPDF(quotation) {
  const {
    name,
    projectName,
    area,
    amount,
    discount,
    discountedPrice,
    validFromDate,
    validToDate,
    salesPersonName,
    SoftoClient,
    Package,
    packageDetails,
  } = quotation;

  const client = SoftoClient || {};
  const packageName = Package?.name || "N/A";

  const detailsTable = {
    table: {
      widths: ["*"],
      body: [
        [{ text: "Quotation Summary", style: "header" }],
        [{ text: `Client Name: ${client.fullName || "N/A"}` }],
        [{ text: `Project Name: ${projectName}` }],
        [{ text: `Package: ${packageName}` }],
        [{ text: `Area: ${area}` }],
        [{ text: `Total Amount: ₹${amount}` }],
        [{ text: `Discount: ${discount}%` }],
        [{ text: `Discounted Price: ₹${discountedPrice}` }],
        [{ text: `Valid From: ${new Date(validFromDate).toLocaleDateString()}` }],
        [{ text: `Valid To: ${new Date(validToDate).toLocaleDateString()}` }],
        [{ text: `Sales Person: ${salesPersonName}` }],
      ],
    },
    layout: "lightHorizontalLines",
    margin: [0, 0, 0, 20],
  };

  const packageTables = packageDetails.map((space) => {
    const rows = [];

    if (space.spaceType === "description") {
      rows.push(["Sr No", "Work", "Description", "Size", "Price"]);
      space.spaceData.workItems.forEach((item) => {
        rows.push([
          item.srNo,
          item.carpentryWork,
          item.description,
          item.size,
          item.price,
        ]);
      });
    } else if (space.spaceType === "squareNet") {
      rows.push([
        "Sr No",
        "Item",
        "Nos",
        "Width",
        "Length",
        "SqFt",
        "Price/SqFt",
        "Total",
      ]);
      space.spaceData.workItems.forEach((item) => {
        rows.push([
          item.srNo,
          item.item,
          item.nos,
          item.width,
          item.length,
          item.sqFt,
          item.pricePerSqFt,
          item.total,
        ]);
      });
    }

    return [
      { text: `Space: ${space.spaceName}`, style: "subheader", margin: [0, 10, 0, 5] },
      {
        table: {
          headerRows: 1,
          widths: Array(rows[0].length).fill("*"),
          body: rows,
        },
        layout: "lightHorizontalLines",
      },
    ];
  });

  const docDefinition = {
    content: [
      { text: "Quotation", style: "title" },
      detailsTable,
      ...packageTables.flat(),
    ],
    styles: {
      title: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      header: { fontSize: 14, bold: true, margin: [0, 5, 0, 5] },
      subheader: { fontSize: 13, bold: true },
    },
    defaultStyle: {
      font: "Courier",
    },
  };

  return printer.createPdfKitDocument(docDefinition);
}

module.exports = { generateQuotationPDF };

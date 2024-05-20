const ExcelJS = require('exceljs');
const fs = require('fs');

const createExcelStream = async ({
    filePath,
    rows,
    data,
    worksheetName = "New Sheet",
    columns,
    width = 30,
    bold = true,
    worksheetOption,
    footer
}) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const options = Object.keys(data)
        for (items of options) {
            workbook[items] = options[items]
        }
        const worksheet = workbook.addWorksheet(worksheetName, worksheetOption);
        if (footer) worksheet.headerFooter.oddFooter = footer;
        worksheet.columns = columns?.map((v) => {
            return {
                ...v,
                width
            }
        })
        worksheet.getRow(1).font = { bold }
        worksheet.addRows(rows);
        const buffer = await workbook.xlsx.writeBuffer();
        const outputFileStream = fs.createWriteStream(filePath);
        outputFileStream.write(buffer);
        outputFileStream.end();
        await workbook.xlsx.write(outputFileStream);

    } catch (err) {
        console.warn(err);
    }
}

const readExcelFile = async ({
    filePath
}) => {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet();
        const headerRow = worksheet.getRow(1).values;
        worksheet.spliceRows(1, 1);
        const rows = [];
        worksheet.eachRow({ includeEmpty: false, skip: 1 },(row) => {
                const rowValues = row.values;
                const rowData = {};
                headerRow.forEach((header, columnIndex) => {
                    rowData[header?.toLowerCase()] = rowValues[columnIndex];
                });
                rows.push(rowData);
            }
        );

        return rows;
    }
    catch (err) {
        console.warn(err)
    }
}

module.exports = {
    createExcelStream,
    readExcelFile
}

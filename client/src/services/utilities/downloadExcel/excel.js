import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const truncateTextWithEllipsis = (text, maxLength = 50) => {
  const ellipsis = "...";
  if (text.length > maxLength) {
    return text.substring(0, maxLength - ellipsis.length) + ellipsis;
  }
  return text;
};

const flattenArray = (array) => {
  const male = [],
    female = [],
    head = [];

  for (const key in array[0]) {
    const settings = new Map([
      ["Date (MM,DD,YY)", { text: "Date (MM,DD,YY)", space: 3 }],

      ["product", { text: "Product", space: 4 }],
      ["hasVariant", { text: "", dnone: true }],
      ["variant", { text: "", dnone: true }],
      ["sold", { text: "Sold" }],
      ["unit", { text: "Unit" }],
      ["capital", { text: "Capital" }],
      ["srp", { text: "SRP" }],
      ["sales", { text: "Sales" }],
      ["income", { text: "Income" }],
    ]).get(key) || { text: key, space: 3 };

    if (key !== "isMale") head.push(settings);
  }

  for (const { isMale, ...rest } of array) {
    male.push(Object.values(rest));
  }

  return {
    male,
    female,
    head,
  };
};

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  getAlpha = (pos) => {
    let result = "";
    const base = 26;

    while (pos >= 0) {
      result = alphabets[pos % base] + result;
      pos = Math.floor(pos / base) - 1;

      if (pos < 0) {
        break;
      }
    }

    return result;
  };

const set = {
  image: async ({ worksheet, workbook }) => {
    // worksheet.mergeCells("A1", "");
  },
  banner: ({ worksheet, options }) => {
    const { title: file, from, to, salesOverView: sales = [] } = options;

    const headers = [
      "Gross Sales",
      "Refund",
      "Discount",
      "Net Sales",
      "Income",
      "Vatable Sales",
      "VAT(12%)",
    ];

    worksheet.mergeCells("C1:V1");
    const title = worksheet.getCell("V1");
    title.value = file;
    title.font = { bold: true, size: 25 };
    title.alignment = { horizontal: "center" };

    const generateStaticCell = ({
      prevCol,
      startPos,
      title,
      space,
      isLabel = false,
      isSales = false,
      nowrap = false,
      isTop = false,
      textColor = "",
    }) => {
      var font = { size: isSales ? 12 : 9, name: "SansSerif" };
      const cellPos = `${getAlpha(prevCol)}${startPos}`;
      const range = `${cellPos}:${getAlpha(prevCol + space - 1)}${startPos}`;
      worksheet.mergeCells(range);

      const cell = worksheet.getCell(cellPos);
      cell.value = title;
      cell.alignment = {
        horizontal: isLabel && !nowrap ? "right" : "left",
        vertical: isTop ? "top" : "middle",
        wrapText: true,
      };
      if (!isLabel) {
        font = {
          ...font,
          bold: true,
          size: isSales ? 15 : 10,
          color: { argb: textColor },
        };
      }

      cell.font = font;

      worksheet.getRow(startPos).height = 20;
    };

    const staticCellsData = [
      {
        prevCol: 8,
        space: 1,
        title: "From:",
        startPos: 2,
        isLabel: true,
        isTop: true,
      },
      {
        prevCol: 9,
        space: 2,
        title: from,
        startPos: 2,
        isLabel: false,
      },
      {
        prevCol: 12,
        space: 1,
        title: "To:",
        isTop: true,
        startPos: 2,
        isLabel: true,
      },
      {
        prevCol: 13,
        space: 2,
        title: to,
        startPos: 2,
      },
    ];

    staticCellsData.forEach(generateStaticCell);

    worksheet.mergeCells("A3:D3");
    const salesOverView = worksheet.getCell("D3");
    salesOverView.value = "Sales Overview";
    salesOverView.font = { bold: true, size: 15, name: "Times New Roman" };
    salesOverView.alignment = { horizontal: "left" };

    let prevCol = 0;
    const space = 4;

    const processOverview = (startingRow, overViews, isValue = false) => {
      for (const text of overViews) {
        const headPos = `${getAlpha(prevCol)}${startingRow}`;
        const head = worksheet.getCell(headPos);
        const rowHead = worksheet.getRow(`${startingRow}`);
        rowHead.height = isValue ? 30 : 40;
        head.value = text;
        head.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        head.font = {
          bold: !isValue,
          size: 12,
        };
        head.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" },
        };

        if (space > 1) {
          worksheet.mergeCells(
            `${headPos}:${getAlpha(prevCol + space - 1)}${startingRow}`
          );
        }

        prevCol += space;
      }
    };
    processOverview(4, headers);
    prevCol = 0;
    processOverview(5, sales, true);
  },
  main: ({
    worksheet,
    head = [],
    male = [],
    isDetailed = true,
    labelOfProducts,
  }) => {
    worksheet.addRow([]);

    worksheet.mergeCells("A7:D7");
    const salesOverView = worksheet.getCell("D7");
    salesOverView.value = labelOfProducts;
    salesOverView.font = { bold: true, size: 13, name: "Times New Roman" };
    salesOverView.alignment = { horizontal: "left" };

    const startingRow = 8;

    let prevCol = 0;

    for (const { text, space = 3, dnone = false } of head) {
      if (!dnone) {
        const headPos = `${getAlpha(prevCol)}${startingRow}`;
        const head = worksheet.getCell(headPos);
        const rowHead = worksheet.getRow(`${startingRow}`);
        rowHead.height = 40;
        head.value = text;
        head.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        head.font = { bold: true, size: 12 };
        head.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" },
        };

        if (space > 1) {
          worksheet.mergeCells(
            `${headPos}:${getAlpha(prevCol + space - 1)}${startingRow}`
          );
        }

        prevCol += space;
      }
    }

    function processArray(array, startPos) {
      for (let i = 0; i < array.length; i++) {
        var element = [...array[i]]; // parent array element
        let _prevCol = 0;
        const hasVariant = isDetailed ? element[2] : false;

        var variant = "";
        if (hasVariant) {
          const _element = [...element];
          variant = _element[3];
          _element.splice(2, 2);
          element = _element;
        } else {
          const _element = [...element];
          if (isDetailed) {
            _element.splice(2, 1);
          }
          element = _element;
        }

        // child array
        for (let j = 0; j < element.length; j++) {
          var value = element[j]; // child array value
          const { space = 3 } = head[j] || {};
          const cellPos = `${getAlpha(_prevCol)}${startPos}`;
          const cell = worksheet.getCell(cellPos);
          var alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          };

          if (typeof value === "string") {
            value = truncateTextWithEllipsis(value, 35);
          }
          if (j === 1) {
            if (hasVariant) {
              cell.value = {
                richText: [
                  { text: value, font: { bold: true } },
                  { text: `\nVariant:${variant}`, font: { size: 10 } },
                ],
              };
            } else {
              if (isDetailed) {
                cell.font = { bold: true };
              }
              cell.value = value;
            }
            if (isDetailed) {
              alignment = {
                ...alignment,
                horizontal: "left",
                vertical: "middle",
                wrapText: true,
              };
            }
          } else {
            cell.value = value;
          }
          cell.alignment = alignment;
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
          };

          if (space > 1) {
            worksheet.mergeCells(
              `${cellPos}:${getAlpha(_prevCol + space - 1)}${startPos}`
            );
          }
          worksheet.getRow(startPos).height = 28;
          _prevCol += space;
        }
        startPos++;
      }
    }

    let startPos = startingRow + 1;

    // Process male array
    processArray(male, startPos);
  },
};

// options list
// {
//     sheet: "SHSF-8",
//     filename: "SF-Form-8",
//     title:
//       "School Form 8 Learner's Basic Health and Nutrition Report for Senior  High School (SF8-SHS)",
//     "School Name": "",
//     "School ID": "",
//     District: "",
//     Division: "",
//     Region: "",

//     Semester: "",
//     "School Year": "",

//     "Grade Level": "",
//     Section: "",
//     "Track and Strand": "",
//     "Course/s (only for TVL)": "",
//   }
const excel = async ({ array = [], options = {}, isDetailed = true }) => {
  if (!array.length) return;

  const { sheet, filename, signatures, labelOfProducts, ...rest } = options;

  const workbook = new ExcelJS.Workbook(),
    worksheet = workbook.addWorksheet(sheet),
    { male, female, head } = flattenArray(array);

  //  Set the showGridLines property to false to hide grid lines
  worksheet.views = [{ showGridLines: false }];

  set.image({ worksheet, workbook, options: rest });
  set.banner({ worksheet, options: rest });
  set.main({
    worksheet,
    head,
    male,
    female,
    options: rest,
    isDetailed,
    labelOfProducts,
  });
  // const headLength = Object.keys(rest).length - 1;
  // const footerSkip = headLength <= 5 ? 5 : headLength <= 10 ? 7 : 9;
  // const skip = footerSkip + 6 + male.length + female.length;
  // set.footer({ worksheet, skip, signatures });

  // Save the workbook
  await workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${filename}-${new Date().toDateString()}.xlsx`);
  });
};

export default excel;

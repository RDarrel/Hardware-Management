import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const flattenArray = (array) => {
  const male = [],
    female = [],
    head = [];

  for (const key in array[0]) {
    const settings = new Map([
      ["cashier", { text: "Cashier", space: 4 }],
      ["invoice", { text: "Invoice No." }],
      ["date", { text: "Date" }],
      ["totalAmount", { text: "Total Amount" }],
      ["cash", { text: "Cash" }],
      ["change", { text: "Change" }],
    ]).get(key) || { text: key.toUpperCase(), space: 2 };

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
    const { title: file, from, to, totalSales } = options;

    worksheet.mergeCells("A1:O1");
    const title = worksheet.getCell("A1");
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
      //ROW 2
      {
        prevCol: 4,
        space: 1,
        title: "From:",
        startPos: 2,
        isLabel: true,
        isTop: true,
      },
      {
        prevCol: 5,
        space: 2,
        title: from,
        startPos: 2,
        isLabel: false,
      },
      {
        prevCol: 8,
        space: 1,
        title: "To:",
        isTop: true,
        startPos: 2,
        isLabel: true,
      },
      {
        prevCol: 9,
        space: 2,
        title: to,
        startPos: 2,
      },
      //ROW 4
      {
        prevCol: 0,
        space: 3,
        title: "Grand Total Sales:",
        isSales: true,
        startPos: 4,
        isLabel: true,
      },
      {
        prevCol: 3,
        space: 2,
        title: totalSales,
        isSales: true,
        startPos: 4,
        textColor: "FFFF0000",
      },
    ];

    staticCellsData.forEach(generateStaticCell);
  },
  main: ({ worksheet, head = [], female = [], male = [] }) => {
    worksheet.addRow([]);

    const startingRow = 5;

    let prevCol = 0;

    for (const { text, space = 2, dnone = false } of head) {
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

        // child array
        for (let j = 0; j < element.length; j++) {
          var value = element[j]; // child array value
          const { space = 2 } = head[j] || {};
          const cellPos = `${getAlpha(_prevCol)}${startPos}`;
          const cell = worksheet.getCell(cellPos);
          var alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          };

          // if (typeof value === "string") {
          // value = truncateTextWithEllipsis(value, 35);
          // }
          // if (j === 1) {
          //   if (hasVariant) {
          //     cell.value = {
          //       richText: [
          //         { text: value, font: { bold: true } },
          //         { text: `\nVariant:${variant}`, font: { size: 10 } },
          //       ],
          //     };
          //   } else {
          //     cell.font = { bold: true };
          //     cell.value = value;
          //   }
          //   alignment = {
          //     ...alignment,
          //     horizontal: "left",
          //     vertical: "middle",
          //     wrapText: true,
          //   };
          // } else {
          cell.value = value;
          // }
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
const transactionsExcel = async ({ array = [], options = {} }) => {
  if (!array.length) return;

  const { sheet, filename, signatures, ...rest } = options;

  const workbook = new ExcelJS.Workbook(),
    worksheet = workbook.addWorksheet(sheet),
    { male, female, head } = flattenArray(array);

  //  Set the showGridLines property to false to hide grid lines
  worksheet.views = [{ showGridLines: false }];

  set.image({ worksheet, workbook, options: rest });
  set.banner({ worksheet, options: rest });
  set.main({ worksheet, head, male, female, options: rest });
  // Save the workbook
  await workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${filename}-${new Date().toDateString()}.xlsx`);
  });
};

export default transactionsExcel;

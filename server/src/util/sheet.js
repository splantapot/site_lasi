/**
 * A sheet with rows in style: `Name / mediaA / MediaB / ...`
 * 
 * Turns into: `{mediaa: "value", mediab: "value" ...}`
 *  */ 
function formatMediaSheet(rows = [], headerRow = 1, startColumn = 1) {
    // Header Row starts in 0
    // Start Column starts in 0

    if (!rows || rows.length <= headerRow) return []; 
    const header = rows[headerRow] || [];
    if (!header || header.length <= startColumn) return [];

    const medias = [];
    rows.forEach((row, j) => {
        if (j <= headerRow) return;
        const rowObj = {}
        header.forEach((key, i) => {
            if (i < startColumn) return;
            const valid_key = key.toLowerCase().replaceAll(' ', '');
            const value = i < row.length? row[i] : undefined;
            if (!value) return;
            rowObj[valid_key] = value;
            // console.log(`${valid_key}:${i}  == ${value}`);
        });
        medias.push(rowObj);
    });

    return medias;
}

export default formatMediaSheet;
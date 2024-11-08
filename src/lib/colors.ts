export const colorOptions = [
    '#ff6363', // A brighter red.
    '#ff6b8a', // A vibrant pink.
    '#c05dcf', // A rich purple.
    '#b067e9', // A lighter purple.
    '#8a61f5', // A bold indigo.
    '#7175fa', // A lighter indigo.
    '#8eb7ff', // A sky blue.
    '#42e0c0', // A fresh aqua.
    '#4dee8a', // A mint green.
    '#9ef07a', // A lime green.
    '#ffe374', // A warm yellow.
    '#ff9f74', // A peachy orange.
];

export const colorMapByTable: Record<string, string> = {
    bill: '#8eb7ff', // A sky blue.
    plant: '#ff9f74', // A peachy orange.
    meta: '#c05dcf', // A rich purple.
    user: '#b067e9', // A lighter purple.
    users: '#b067e9', // A lighter purple.
    role: '#ffe374', // A warm yellow.
    roles: '#ffe374', // A warm yellow.
    default: '#ffffff', // A lighter indigo.
};

export const randomColor = () => {
    return colorOptions[Math.floor(Math.random() * colorOptions.length)];
};

export const getTableColor = (tableName: string) => {
    const startName = tableName.split('_')[0];
    return startName in colorMapByTable
        ? colorMapByTable[startName]
        : colorMapByTable['default'];
};

export const viewColor = '#b0b0b0';
export const materializedViewColor = '#7d7d7d';

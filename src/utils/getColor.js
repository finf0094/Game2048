export const getColor = (num) => {
    switch (num) {
        case 2:
            return "#FFFFE0";
        case 4:
            return "#FFDAB9";
        case 8:
            return "#FFA500";
        case 16:
            return "#FF4500";
        case 32:
            return "#FF8C00";
        case 64:
            return "#8B0000";
        case 128:
            return "#FFD700";
        case 256:
            return "#FFFF00";
        default:
            return "#FFFAF0";
    }
}
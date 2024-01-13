/**
 * Format a number into a fixed-point decimal
 */
export default function NumericConversion(data) {
    if (data) {
        if (Number.isInteger(data)) {
            return data;
        } else {
            return data.toFixed(2);
        }
    } else {
        return data;
    }
}

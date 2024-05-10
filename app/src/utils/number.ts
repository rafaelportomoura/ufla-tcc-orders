export const two_decimals_number = (num: number) => Math.floor(num) === num || num.toString().split('.')[1].length <= 2;

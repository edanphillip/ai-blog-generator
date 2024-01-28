
export type CurrencyCode =
  "ALL" |
  "AFN" |
  "ARS" |
  "AWG" |
  "AUD" |
  "AZN" |
  "BSD" |
  "BBD" |
  "BYN" |
  "BZD" |
  "BMD" |
  "BOB" |
  "BAM" |
  "BWP" |
  "BGN" |
  "BRL" |
  "BND" |
  "KHR" |
  "CAD" |
  "KYD" |
  "CLP" |
  "CNY" |
  "COP" |
  "CRC" |
  "HRK" |
  "CUP" |
  "CZK" |
  "DKK" |
  "DOP" |
  "XCD" |
  "EGP" |
  "SVC" |
  "EUR" |
  "FKP" |
  "FJD" |
  "GHS" |
  "GIP" |
  "GTQ" |
  "GGP" |
  "GYD" |
  "HNL" |
  "HKD" |
  "HUF" |
  "ISK" |
  "INR" |
  "IDR" |
  "IRR" |
  "IMP" |
  "ILS" |
  "JMD" |
  "JPY" |
  "JEP" |
  "KZT" |
  "KPW" |
  "KRW" |
  "KGS" |
  "LAK" |
  "LBP" |
  "LRD" |
  "MKD" |
  "MYR" |
  "MUR" |
  "MXN" |
  "MNT" |
  "MZN" |
  "NAD" |
  "NPR" |
  "ANG" |
  "NZD" |
  "NIO" |
  "NGN" |
  "NOK" |
  "OMR" |
  "PKR" |
  "PAB" |
  "PYG" |
  "PEN" |
  "PHP" |
  "PLN" |
  "QAR" |
  "RON" |
  "RUB" |
  "SHP" |
  "SAR" |
  "RSD" |
  "SCR" |
  "SGD" |
  "SBD" |
  "SOS" |
  "ZAR" |
  "LKR" |
  "SEK" |
  "CHF" |
  "SRD" |
  "SYP" |
  "TWD" |
  "THB" |
  "TTD" |
  "TRY" |
  "TVD" |
  "UAH" |
  "AED" |
  "GBP" |
  "USD" |
  "UYU" |
  "UZS" |
  "VEF" |
  "VND" |
  "YER" |
  "ZWD";

export function getCurrencyCodeSymbol(isoCode: CurrencyCode) {
  switch (isoCode) {
    case "ALL": return 'Lek';
    case "AFN": return '؋';
    case "ARS": return '$';
    case "AWG": return 'ƒ';
    case "AUD": return '$';
    case "AZN": return '₼';
    case "BSD": return '$';
    case "BBD": return '$';
    case "BYN": return 'Br';
    case "BZD": return 'BZ$';
    case "BMD": return '$';
    case "BOB": return '$b';
    case "BAM": return 'KM';
    case "BWP": return 'P';
    case "BGN": return 'лв';
    case "BRL": return 'R$';
    case "BND": return '$';
    case "KHR": return '៛';
    case "CAD": return '$';
    case "KYD": return '$';
    case "CLP": return '$';
    case "CNY": return '¥';
    case "COP": return '$';
    case "CRC": return '₡';
    case "HRK": return 'kn';
    case "CUP": return '₱';
    case "CZK": return 'Kč';
    case "DKK": return 'kr';
    case "DOP": return 'RD$';
    case "XCD": return '$';
    case "EGP": return '£';
    case "SVC": return '$';
    case "EUR": return '€';
    case "FKP": return '£';
    case "FJD": return '$';
    case "GHS": return '¢';
    case "GIP": return '£';
    case "GTQ": return 'Q';
    case "GGP": return '£';
    case "GYD": return '$';
    case "HNL": return 'L';
    case "HKD": return '$';
    case "HUF": return 'Ft';
    case "ISK": return 'kr';
    case "INR": return '₹';
    case "IDR": return 'Rp';
    case "IRR": return '﷼';
    case "IMP": return '£';
    case "ILS": return '₪';
    case "JMD": return 'J$';
    case "JPY": return '¥';
    case "JEP": return '£';
    case "KZT": return 'лв';
    case "KPW": return '₩';
    case "KRW": return '₩';
    case "KGS": return 'лв';
    case "LAK": return '₭';
    case "LBP": return '£';
    case "LRD": return '$';
    case "MKD": return 'ден';
    case "MYR": return 'RM';
    case "MUR": return '₨';
    case "MXN": return '$';
    case "MNT": return '₮';
    case "MZN": return 'MT';
    case "NAD": return '$';
    case "NPR": return '₨';
    case "ANG": return 'ƒ';
    case "NZD": return '$';
    case "NIO": return 'C$';
    case "NGN": return '₦';
    case "NOK": return 'kr';
    case "OMR": return '﷼';
    case "PKR": return '₨';
    case "PAB": return 'B /.';
    case "PYG": return 'Gs';
    case "PEN": return 'S /.';
    case "PHP": return '₱';
    case "PLN": return 'zł';
    case "QAR": return '﷼';
    case "RON": return 'lei';
    case "RUB": return '₽';
    case "SHP": return '£';
    case "SAR": return '﷼';
    case "RSD": return 'Дин.';
    case "SCR": return '₨';
    case "SGD": return '$';
    case "SBD": return '$';
    case "SOS": return 'S';
    case "ZAR": return 'R';
    case "LKR": return '₨';
    case "SEK": return 'kr';
    case "CHF": return 'CHF';
    case "SRD": return '$';
    case "SYP": return '£';
    case "TWD": return 'NT$';
    case "THB": return '฿';
    case "TTD": return 'TT$';
    case "TRY": return '₺';
    case "TVD": return '$';
    case "UAH": return '₴';
    case "AED": return 'د.إ';
    case "GBP": return '£';
    case "USD": return '$';
    case "UYU": return '$U';
    case "UZS": return 'лв';
    case "VEF": return 'Bs';
    case "VND": return '₫';
    case "YER": return '﷼';
    case "ZWD": return 'Z$';
  }
} 
import { Injectable } from '@angular/core';

const Web3 = require('web3');

@Injectable()
export class Utils {

    prefixHex(hex): string {
        return hex.substring(0, 2) === '0x' ? hex : '0x' + hex;
    }

    sanitizeHex(hex): string {
        hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
        if (hex === '') {
            return '';
        }
        return '0x' + this.padLeftEven(hex);
    }

    private padLeftEven (hex): string {
        hex = hex.length % 2 !== 0 ? '0' + hex : hex;
        return hex;
    }

    getNakedAddress (address): string {
        return address.toLowerCase().replace('0x', '');
    }

    getFunctionSignature (name): string {
        return Web3.utils.sha3(name).substr(0, 10);
    }

    hexToDecimal(hex) {
        return parseInt(hex, 16);
    }
}

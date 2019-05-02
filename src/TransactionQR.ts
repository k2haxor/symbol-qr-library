/**
 * Copyright 2019 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *limitations under the License.
 */
import {
    NetworkType,
    TransactionMapping,
    Transaction,
} from "nem2-sdk";

// internal dependencies
import {
    QRCode,
    QRCodeInterface,
    QRCodeType,
    QRCodeSettings,
} from '../index';

export class TransactionQR extends QRCode implements QRCodeInterface {
    /**
     * Construct a Transaction Request QR Code out of the
     * nem2-sdk Transaction instance.
     * 
     * @param   transaction     {Transaction}
     * @param   networkType     {NetworkType}
     * @param   chainId         {string}
     */
    constructor(/**
                 * The transaction for the request.
                 * @var {Transaction}
                 */
                public readonly transaction: Transaction,
                /**
                 * The network type.
                 * @var {NetworkType}
                 */
                public readonly networkType: NetworkType,
                /**
                 * The chain Id.
                 * @var {string}
                 */
                public readonly chainId: string) {
        super(QRCodeType.RequestTransaction, networkType, chainId);
    }

    /**
     * The `toJSON()` method should return the JSON
     * representation of the QR Code content.
     *
     * @return {string}
     */
    public toJSON(): string {

        // take the JSON of the transaction
        const txJSON = this.transaction.toJSON().transaction;

        // remove empty `signature` and `signer` fields
        if (txJSON.hasOwnProperty('signature') && !txJSON.signature.length) {
            delete txJSON['signature'];
        }
        if (txJSON.hasOwnProperty('signer') && !txJSON.signer.length) {
            delete txJSON['signer'];
        }

        const jsonSchema = {
            'v': 3,
            'type': this.type,
            'network_id': this.networkType,
            'chain_id': this.chainId,
            'data': txJSON,
        };

        return JSON.stringify(jsonSchema);
    }
}
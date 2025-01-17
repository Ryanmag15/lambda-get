import { expect } from 'chai';
import { describe, it } from 'mocha';
import { lambdaHandler } from '../../app.mjs';

describe('Unit test for app handler', function () {
    it('verifies successful response', async () => {
        const event = {
            httpMethod: 'GET',
            body: '{"productName": "BANANA PRATA ESP. kg", "userLatitude": -19.87811, "userLongitude": -43.99649, "maxDistance": 10}',
            headers: {},
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/products',
            pathParameters: {},
            queryStringParameters: {},
            requestContext: {
                accountId: '123456789012',
                apiId: '1234',
                authorizer: {},
                httpMethod: 'GET',
                identity: {
                    accessKey: '',
                    accountId: '',
                    apiKey: '',
                    apiKeyId: '',
                    caller: '',
                    clientCert: {
                        clientCertPem: '',
                        issuerDN: '',
                        serialNumber: '',
                        subjectDN: '',
                        validity: { notAfter: '', notBefore: '' },
                    },
                    cognitoAuthenticationProvider: '',
                    cognitoAuthenticationType: '',
                    cognitoIdentityId: '',
                    cognitoIdentityPoolId: '',
                    principalOrgId: '',
                    sourceIp: '',
                    user: '',
                    userAgent: '',
                    userArn: '',
                },
                path: '/hello',
                protocol: 'HTTP/1.1',
                requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                requestTimeEpoch: 1428582896000,
                resourceId: '123456',
                resourcePath: '/hello',
                stage: 'dev',
            },
            resource: '',
            stageVariables: {},
        };
        const result = await lambdaHandler(event);

        console.log(result);

        expect(result.statusCode).to.equal(200);
    });
});

import forge from 'node-forge';

export interface ParsedCertificateData {
    subject_cn: string;
    subject_c: string;
    subject_o: string;
    issuer_cn: string;
    issuer_c: string;
    issuer_o: string;
    certificate_expire: string;
    certificate_cnpj: string | null;
}

function formatDateToInput(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getAttrValue(attrs: forge.pki.CertificateField[], shortName: string): string {
    const value = attrs.find((attr) => attr.shortName === shortName)?.value;

    if (typeof value === 'string') {
        return value;
    }

    return '';
}

function onlyDigits(value: string): string {
    return value.replace(/\D/g, '');
}

function extractCnpjFromCertificate(
    subjectAttrs: forge.pki.CertificateField[]
): string | null {

    // 1) Tenta extrair do commonName (CN) após ":"
    const cnValue = subjectAttrs.find(
        (attr) => attr.shortName === 'CN'
    )?.value;

    if (typeof cnValue === 'string') {
        const match = cnValue.match(/:(\d{14})$/);
        if (match) {
            return match[1];
        }
    }

    // 2) Fallback: tenta serialNumber
    const serialValueRaw = subjectAttrs.find(
        (attr) => attr.shortName === 'serialNumber'
    )?.value;

    const serialDigits =
        typeof serialValueRaw === 'string'
            ? serialValueRaw.replace(/\D/g, '')
            : '';

    if (serialDigits.length >= 14) {
        return serialDigits.slice(0, 14);
    }

    // 3) Fallback final: busca qualquer CNPJ no subject inteiro
    const allSubjectValues = subjectAttrs
        .map((attr) =>
            typeof attr.value === 'string' ? attr.value : ''
        )
        .join(' ');

    const matches = allSubjectValues.match(/\d{14}/);

    return matches ? matches[0] : null;
}

function arrayBufferToBinaryString(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';

    for (let i = 0; i < bytes.length; i += 1) {
        binary += String.fromCharCode(bytes[i]);
    }

    return binary;
}

function getPrimaryCertificate(certificates: forge.pki.Certificate[]): forge.pki.Certificate {
    if (!certificates.length) {
        throw new Error('Nenhum certificado encontrado no arquivo.');
    }

    const certificateWithMostSubjectFields = [...certificates].sort(
        (a, b) => b.subject.attributes.length - a.subject.attributes.length,
    )[0];

    return certificateWithMostSubjectFields;
}

export async function readDigitalCertificate(
    certificateFile: File,
    password: string,
): Promise<ParsedCertificateData> {
    if (!certificateFile) {
        throw new Error('Selecione um certificado digital para continuar.');
    }

    const extension = certificateFile.name.split('.').pop()?.toLowerCase();

    if (extension !== 'pfx' && extension !== 'p12') {
        throw new Error('Formato inválido. Utilize um arquivo .pfx ou .p12.');
    }

    try {
        const fileBuffer = await certificateFile.arrayBuffer();
        const binary = arrayBufferToBinaryString(fileBuffer);
        const derBuffer = forge.util.createBuffer(binary, 'raw');
        const asn1 = forge.asn1.fromDer(derBuffer);
        const p12 = forge.pkcs12.pkcs12FromAsn1(asn1, false, password);

        const certBags = p12.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag] ?? [];
        const certificates = certBags
            .map((bag) => bag.cert)
            .filter((cert): cert is forge.pki.Certificate => Boolean(cert));

        const certificate = getPrimaryCertificate(certificates);
        console.log(certificate);
        return {
            subject_cn: getAttrValue(certificate.subject.attributes, 'CN'),
            subject_c: getAttrValue(certificate.subject.attributes, 'C'),
            subject_o: getAttrValue(certificate.subject.attributes, 'O'),
            issuer_cn: getAttrValue(certificate.issuer.attributes, 'CN'),
            issuer_c: getAttrValue(certificate.issuer.attributes, 'C'),
            issuer_o: getAttrValue(certificate.issuer.attributes, 'O'),
            certificate_expire: formatDateToInput(certificate.validity.notAfter),
            certificate_cnpj: extractCnpjFromCertificate(certificate.subject.attributes),
        };
    } catch {
        throw new Error('Nao foi possivel ler o certificado. Verifique se a senha esta correta.');
    }
}

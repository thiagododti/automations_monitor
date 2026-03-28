import { useState, useRef } from 'react';
import { readDigitalCertificate, type ParsedCertificateData } from '@/features/business/lib/certificate';

function onlyDigits(value: string): string {
    return value.replace(/\D/g, '');
}

interface UseBusinessCertificateOptions {
    getCnpj: () => string;
    onDataParsed: (data: ParsedCertificateData) => void;
}

export function useBusinessCertificate({ getCnpj, onDataParsed }: UseBusinessCertificateOptions) {
    const [certFile, setCertFile] = useState<File | undefined>(undefined);
    const [certificatePassword, setCertificatePassword] = useState('');
    const [certificateReadError, setCertificateReadError] = useState<string | null>(null);
    const [certificateValidationOk, setCertificateValidationOk] = useState(false);
    const [isReadingCertificate, setIsReadingCertificate] = useState(false);
    const certInputRef = useRef<HTMLInputElement>(null);

    const handleReadCertificate = async () => {
        if (!certFile) {
            setCertificateReadError('Selecione um certificado .pfx ou .p12 antes de ler os dados.');
            return;
        }
        if (!certificatePassword.trim()) {
            setCertificateReadError('Informe a senha do certificado para continuar.');
            return;
        }
        const cnpj = getCnpj();
        setCertificateReadError(null);
        setIsReadingCertificate(true);
        try {
            const parsed = await readDigitalCertificate(certFile, certificatePassword);
            const formCnpjDigits = onlyDigits(cnpj || '');
            const certificateCnpjDigits = parsed.certificate_cnpj ? onlyDigits(parsed.certificate_cnpj) : '';
            if (!formCnpjDigits) {
                setCertificateValidationOk(false);
                setCertificateReadError('Informe o CNPJ da empresa antes de validar o certificado.');
                return;
            }
            if (!certificateCnpjDigits) {
                setCertificateValidationOk(false);
                setCertificateReadError('Não foi possível identificar o CNPJ dentro do certificado.');
                return;
            }
            if (formCnpjDigits !== certificateCnpjDigits) {
                setCertificateValidationOk(false);
                setCertificateReadError('O CNPJ do certificado é diferente do CNPJ da empresa informada.');
                return;
            }
            setCertificateValidationOk(true);
            onDataParsed(parsed);
        } catch (error) {
            setCertificateValidationOk(false);
            setCertificateReadError(error instanceof Error ? error.message : 'Erro ao ler o certificado.');
        } finally {
            setIsReadingCertificate(false);
        }
    };

    const resetCertificate = () => {
        setCertFile(undefined);
        setCertificatePassword('');
        setCertificateReadError(null);
        setCertificateValidationOk(false);
        if (certInputRef.current) certInputRef.current.value = '';
    };

    return {
        certFile,
        setCertFile,
        certInputRef,
        certificatePassword,
        setCertificatePassword,
        certificateReadError,
        setCertificateReadError,
        certificateValidationOk,
        isReadingCertificate,
        handleReadCertificate,
        resetCertificate,
    };
}

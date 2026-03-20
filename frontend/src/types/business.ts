export interface Business {
    id: number;
    name: string;
    description: string;
    cnpj: string;
    created_at: string;
    updated_at: string;
    logo: string;
    certificado: string;
    certificate_expire: string;
    subject_cn: string;
    subject_c: string;
    subject_o: string;
    issuer_cn: string;
    issuer_c: string;
    issuer_o: string
}

export interface BusinessCreate {
    name: string;
    description: string;
    cnpj: string;
    logo?: File | null;
    certificado: File;
    certificate_expire?: string;
    subject_cn: string;
    subject_c: string;
    subject_o: string;
    issuer_cn: string;
    issuer_c: string;
    issuer_o: string

}

export interface BusinessUpdate extends Partial<BusinessCreate> { }

export interface BusinessFilters {
    name?: string;
    description?: string;
    cnpj?: string;
}

export interface BusinessOption {
    id: number;
    name: string;
}

export interface BusinessDetails {
    name: string;
    cnpj: string;
    logo: string;
} 
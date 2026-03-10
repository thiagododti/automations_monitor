export default function buildBody(payload: any) {
    const hasFile = Object.values(payload).some(
        (v) => v instanceof File || v instanceof Blob
    );

    if (hasFile) {
        const form = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
            if (v !== undefined && v !== null) form.append(k, v as any);
        });
        return form;
    }

    return JSON.stringify(payload);
}
import { useState, useEffect, useRef } from 'react';
import { useForm, Controller, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateUser, useUpdateUser } from '@/hooks/useUsers';
import { useDepartmentOptions } from '@/hooks/useDepartments';
import type { UserUpdate } from '@/types/user';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Plus, UserRound, ShieldCheck, CircleCheck, Camera, X } from 'lucide-react';

const userFormSchema = z.object({
    username: z.string().min(1, 'Usuário é obrigatório'),
    email: z.union([z.string().email('Email inválido'), z.literal('')]).optional(),
    first_name: z.string().optional().default(''),
    last_name: z.string().optional().default(''),
    telephone: z.string().optional().default(''),
    birthday: z.string().optional().default(''),
    department: z.number().optional(),
    is_active: z.boolean(),
    is_staff: z.boolean(),
    is_superuser: z.boolean(),
    password: z.string().optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

const defaultValues: UserFormData = {
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    telephone: '',
    birthday: '',
    department: undefined,
    is_active: true,
    is_staff: false,
    is_superuser: false,
    password: '',
};

interface UserDialogProps {
    onSuccess?: () => void;
    onClose?: () => void;
    editData?: {
        id: number;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        telephone?: string | null;
        birthday?: string | null;
        department?: number | null;
        is_active?: boolean;
        is_staff?: boolean;
        is_superuser?: boolean;
        photo?: string | null;
    };
}

export function UserDialog({ onSuccess, onClose, editData }: UserDialogProps) {
    const [open, setOpen] = useState(false);
    const createMutation = useCreateUser();
    const updateMutation = useUpdateUser();
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: departamentos, isLoading: isLoadingDepartments } = useDepartmentOptions(open);

    const { register, handleSubmit, control, reset, setError, formState: { errors } } = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues,
    });

    useEffect(() => {
        if (editData) {
            reset({
                username: editData.username,
                email: editData.email,
                first_name: editData.first_name,
                last_name: editData.last_name,
                telephone: editData.telephone || '',
                birthday: editData.birthday || '',
                department: editData.department ?? undefined,
                is_active: editData.is_active ?? true,
                is_staff: editData.is_staff ?? false,
                is_superuser: editData.is_superuser ?? false,
                password: '',
            });
            setPhotoPreview(editData.photo || null);
            setOpen(true);
        }
    }, [editData, reset]);

    const onSubmit = async (data: UserFormData) => {
        if (!editData && !data.password) {
            setError('password', { message: 'Senha é obrigatória' });
            return;
        }
        try {
            if (editData) {
                const updateData: UserUpdate = {
                    username: data.username,
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    telephone: data.telephone,
                    birthday: data.birthday,
                    department: data.department,
                    is_active: data.is_active,
                    is_staff: data.is_staff,
                    is_superuser: data.is_superuser,
                };
                if (data.password) updateData.password = data.password;
                if (photoFile) updateData.photo = photoFile;
                await updateMutation.mutateAsync({ id: editData.id, data: updateData });
            } else {
                await createMutation.mutateAsync({
                    username: data.username,
                    email: data.email || '',
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    telephone: data.telephone,
                    birthday: data.birthday,
                    department: data.department,
                    is_active: data.is_active,
                    is_staff: data.is_staff,
                    is_superuser: data.is_superuser,
                    password: data.password!,
                    photo: photoFile,
                });
            }
            setOpen(false);
            reset(defaultValues);
            setPhotoPreview(null);
            setPhotoFile(undefined);
            onSuccess?.();
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
        }
    };

    const handleOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) {
            reset(defaultValues);
            setPhotoPreview(null);
            setPhotoFile(undefined);
            onClose?.();
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Usuário
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border sm:max-w-[520px]">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-foreground flex items-center gap-2 text-lg">
                        <UserRound className="h-5 w-5 text-primary" />
                        {editData ? 'Editar Usuário' : 'Novo Usuário'}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] pr-1">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-1 pr-3">

                        {/* Informações Básicas */}
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Informações Básicas
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={photoPreview || undefined} />
                                        <AvatarFallback className="bg-secondary text-muted-foreground">
                                            <UserRound className="h-7 w-7" />
                                        </AvatarFallback>
                                    </Avatar>
                                    {photoPreview && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPhotoPreview(null);
                                                setPhotoFile(undefined);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            className="absolute -top-1 -right-1 rounded-full bg-destructive p-0.5 text-destructive-foreground hover:bg-destructive/80"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setPhotoFile(file);
                                                setPhotoPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="border-border bg-secondary hover:bg-secondary/80"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Camera className="mr-2 h-4 w-4" />
                                        {photoPreview ? 'Alterar foto' : 'Selecionar foto'}
                                    </Button>
                                    <p className="text-xs text-muted-foreground">JPG, PNG ou GIF. Máx. 5MB.</p>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm text-foreground">Usuário <span className="text-destructive">*</span></Label>
                                <Input
                                    {...register('username')}
                                    placeholder="Nome de usuário"
                                    className="bg-secondary border-border"
                                />
                                {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Nome</Label>
                                    <Input {...register('first_name')} placeholder="Nome" className="bg-secondary border-border" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Sobrenome</Label>
                                    <Input {...register('last_name')} placeholder="Sobrenome" className="bg-secondary border-border" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm text-foreground">Email</Label>
                                <Input
                                    type="email"
                                    {...register('email')}
                                    placeholder="email@exemplo.com"
                                    className="bg-secondary border-border"
                                />
                                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                            </div>
                        </div>

                        <Separator className="bg-border" />

                        {/* Contato */}
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Contato
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Telefone</Label>
                                    <Input {...register('telephone')} placeholder="(00) 00000-0000" className="bg-secondary border-border" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">Data de Nascimento</Label>
                                    <Input type="date" {...register('birthday')} className="bg-secondary border-border" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm text-foreground">Departamento</Label>
                                <Controller
                                    name="department"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value ? String(field.value) : 'none'}
                                            onValueChange={(val) => field.onChange(val === 'none' ? undefined : Number(val))}
                                        >
                                            <SelectTrigger className="bg-secondary border-border w-full">
                                                <SelectValue placeholder="Selecione um departamento" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Nenhum</SelectItem>
                                                {!isLoadingDepartments && departamentos?.map((dept) => (
                                                    <SelectItem key={dept.id} value={String(dept.id)}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator className="bg-border" />

                        {/* Permissões */}
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Permissões
                            </p>
                            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <CircleCheck className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Usuário Ativo</p>
                                        <p className="text-xs text-muted-foreground">Permite que o usuário acesse o sistema</p>
                                    </div>
                                </div>
                                <Controller name="is_active" control={control} render={({ field }) => (
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                )} />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Acesso Staff</p>
                                        <p className="text-xs text-muted-foreground">Concede acesso à área administrativa</p>
                                    </div>
                                </div>
                                <Controller name="is_staff" control={control} render={({ field }) => (
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                )} />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Superusuário</p>
                                        <p className="text-xs text-muted-foreground">Concede acesso total ao sistema</p>
                                    </div>
                                </div>
                                <Controller name="is_superuser" control={control} render={({ field }) => (
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                )} />
                            </div>
                        </div>

                        <Separator className="bg-border" />

                        {/* Segurança */}
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Segurança
                            </p>
                            <div className="space-y-1.5">
                                <Label className="text-sm text-foreground">
                                    Senha {editData
                                        ? <span className="text-muted-foreground font-normal normal-case tracking-normal">(deixe vazio para manter)</span>
                                        : <span className="text-destructive">*</span>}
                                </Label>
                                <Input
                                    type="password"
                                    {...register('password')}
                                    placeholder={editData ? '••••••••' : 'Senha'}
                                    className="bg-secondary border-border"
                                />
                                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editData ? 'Salvar Alterações' : 'Criar Usuário'}
                        </Button>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

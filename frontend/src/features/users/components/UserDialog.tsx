import { Controller } from 'react-hook-form';
import { useUserForm } from '../hooks';
import type { UserEditData } from '../hooks';
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

interface UserDialogProps {
    onSuccess?: () => void;
    onClose?: () => void;
    editData?: UserEditData;
}

export function UserDialog({ onSuccess, onClose, editData }: UserDialogProps) {
    const {
        form,
        open,
        handleOpenChange,
        isLoading,
        departamentos,
        isLoadingDepartments,
        photoPreview,
        setPhotoPreview,
        photoFile,
        setPhotoFile,
        fileInputRef,
        onSubmit,
    } = useUserForm({ editData, onSuccess, onClose });

    const { register, control, formState: { errors } } = form;

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
                    <form onSubmit={onSubmit} className="space-y-5 py-1 pr-3">

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

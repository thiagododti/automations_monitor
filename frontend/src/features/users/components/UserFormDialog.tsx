import { useEffect, useRef, useState } from "react";
import type { CreateUserPayload, UpdateUserPayload, User } from "@/types/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSubmit: (data: CreateUserPayload | UpdateUserPayload) => Promise<void>;
}

export function UserFormDialog({ open, onOpenChange, user, onSubmit }: Props) {
  const isEdit = !!user;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [flashFields, setFlashFields] = useState<Set<string>>(new Set());

  const [form, setForm] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    telephone: "",
    birthday: "",
    is_staff: false,
    is_superuser: false,
    is_active: true,
  });

  const initialValues = useRef(form);

  useEffect(() => {
    if (open && user) {
      const values = {
        username: user.username,
        password: "",
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        telephone: user.telephone || "",
        birthday: user.birthday || "",
        is_staff: user.is_staff,
        is_superuser: user.is_superuser,
        is_active: user.is_active,
      };
      setForm(values);
      initialValues.current = values;
    } else if (open && !user) {
      const values = {
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        telephone: "",
        birthday: "",
        is_staff: false,
        is_superuser: false,
        is_active: true,
      };
      setForm(values);
      initialValues.current = values;
    }
    setError("");
    setFlashFields(new Set());
  }, [open, user]);

  const setField = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (isEdit) {
        // Only send changed fields
        const changed: Record<string, unknown> = {};
        const changedKeys: string[] = [];
        for (const key of Object.keys(form) as (keyof typeof form)[]) {
          if (key === "password") continue;
          if (key === "username") continue;
          if (form[key] !== initialValues.current[key]) {
            changed[key] = form[key];
            changedKeys.push(key);
          }
        }
        if (form.password) {
          changed.password = form.password;
          changedKeys.push("password");
        }
        await onSubmit(changed as UpdateUserPayload);
        // Flash changed fields
        setFlashFields(new Set(changedKeys));
        setTimeout(() => {
          onOpenChange(false);
        }, 500);
      } else {
        await onSubmit(form as CreateUserPayload);
        onOpenChange(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (key: string) =>
    flashFields.has(key) ? "animate-field-flash" : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEdit ? "Editar Usuário" : "Criar Usuário"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={`space-y-2 ${fieldClass("username")}`}>
            <Label htmlFor="form-username">Usuário *</Label>
            <Input
              id="form-username"
              value={form.username}
              onChange={(e) => setField("username", e.target.value)}
              className="font-mono"
              disabled={isEdit}
              required={!isEdit}
            />
          </div>
          <div className={`space-y-2 ${fieldClass("password")}`}>
            <Label htmlFor="form-password">
              Senha {isEdit ? "(deixe vazio para manter)" : "*"}
            </Label>
            <Input
              id="form-password"
              type="password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              required={!isEdit}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`space-y-2 ${fieldClass("first_name")}`}>
              <Label htmlFor="form-first-name">Nome</Label>
              <Input
                id="form-first-name"
                value={form.first_name}
                onChange={(e) => setField("first_name", e.target.value)}
              />
            </div>
            <div className={`space-y-2 ${fieldClass("last_name")}`}>
              <Label htmlFor="form-last-name">Sobrenome</Label>
              <Input
                id="form-last-name"
                value={form.last_name}
                onChange={(e) => setField("last_name", e.target.value)}
              />
            </div>
          </div>

          <div className={`space-y-2 ${fieldClass("email")}`}>
            <Label htmlFor="form-email">Email</Label>
            <Input
              id="form-email"
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`space-y-2 ${fieldClass("telephone")}`}>
              <Label htmlFor="form-telephone">Telefone</Label>
              <Input
                id="form-telephone"
                value={form.telephone}
                onChange={(e) => setField("telephone", e.target.value)}
                className="font-mono"
              />
            </div>
            <div className={`space-y-2 ${fieldClass("birthday")}`}>
              <Label htmlFor="form-birthday">Data de Nascimento</Label>
              <Input
                id="form-birthday"
                type="date"
                value={form.birthday}
                onChange={(e) => setField("birthday", e.target.value)}
                className="font-mono"
              />
            </div>
          </div>

          <div className="flex gap-6 pt-2">
            <div className={`flex items-center gap-2 ${fieldClass("is_active")}`}>
              <Checkbox
                id="form-is-active"
                checked={form.is_active}
                onCheckedChange={(v) => setField("is_active", !!v)}
              />
              <Label htmlFor="form-is-active" className="text-sm">Ativo</Label>
            </div>
            <div className={`flex items-center gap-2 ${fieldClass("is_staff")}`}>
              <Checkbox
                id="form-is-staff"
                checked={form.is_staff}
                onCheckedChange={(v) => setField("is_staff", !!v)}
              />
              <Label htmlFor="form-is-staff" className="text-sm">Staff</Label>
            </div>
            <div className={`flex items-center gap-2 ${fieldClass("is_superuser")}`}>
              <Checkbox
                id="form-is-superuser"
                checked={form.is_superuser}
                onCheckedChange={(v) => setField("is_superuser", !!v)}
              />
              <Label htmlFor="form-is-superuser" className="text-sm">Superusuário</Label>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Salvando..." : isEdit ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Trash2, RefreshCw, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  clearImageErrorLog,
  getImageErrorLog,
  type ImageErrorEntry,
} from "@/lib/imageErrorLog";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const AdminImageLog = () => {
  const { user, loading } = useAuth();
  const [entries, setEntries] = useState<ImageErrorEntry[]>([]);

  const refresh = () => setEntries(getImageErrorLog());

  useEffect(() => {
    if (user) refresh();
  }, [user]);

  const handleClear = () => {
    clearImageErrorLog();
    refresh();
  };

  const fmtDate = (ts: number) =>
    new Date(ts).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "medium" });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Carregando…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen">
      <div className="bg-muted/40 py-8 border-b border-border">
        <div className="container">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                <ImageOff className="h-6 w-6 text-primary" /> Image Fallback Log
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                URLs de imagens que falharam e caíram em fallback temático. Armazenado localmente.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={refresh} className="gap-2">
                <RefreshCw className="h-4 w-4" /> Atualizar
              </Button>
              <Button variant="destructive" size="sm" onClick={handleClear} className="gap-2">
                <Trash2 className="h-4 w-4" /> Limpar log
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Data</TableHead>
                <TableHead className="w-[120px]">Categoria</TableHead>
                <TableHead className="w-[180px]">Página</TableHead>
                <TableHead>URL quebrada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    Nenhum erro de imagem registrado ainda. ✓
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((e, i) => (
                  <TableRow key={`${e.timestamp}-${i}`}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {fmtDate(e.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{e.category}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground truncate max-w-[180px]">
                      {e.page}
                    </TableCell>
                    <TableCell className="text-xs font-mono break-all">
                      <a
                        href={e.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {e.src}
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {entries.length > 0 && (
          <p className="text-xs text-muted-foreground mt-3">
            Mostrando {entries.length} entrada(s). Limite máximo: 200.
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminImageLog;

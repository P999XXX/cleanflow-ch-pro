import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FileText, RefreshCw, Shield } from 'lucide-react';
import { RoleGuard } from '../Auth/RoleGuard';

interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  changed_by: string;
  changed_at: string;
  old_data: any;
  new_data: any;
  user_email: string;
}

export const AuditLogViewer = ({ companyId }: { companyId: string }) => {
  const [tableFilter, setTableFilter] = useState<string>('all');
  const [limit, setLimit] = useState(50);

  const { data: auditLogs, isLoading, refetch } = useQuery({
    queryKey: ['auditLogs', companyId, tableFilter, limit],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_audit_logs', {
        p_company_id: companyId,
        p_table_name: tableFilter === 'all' ? null : tableFilter,
        p_limit: limit,
      });

      if (error) {
        console.error('Error fetching audit logs:', error);
        throw error;
      }

      return data as AuditLog[];
    },
    enabled: !!companyId,
  });

  const getActionBadge = (action: string) => {
    const config = {
      INSERT: { variant: 'default' as const, label: 'Erstellt', className: 'bg-success/10 text-success border-success/20' },
      UPDATE: { variant: 'secondary' as const, label: 'Geändert', className: 'bg-primary/10 text-primary border-primary/20' },
      DELETE: { variant: 'destructive' as const, label: 'Gelöscht', className: 'bg-destructive/10 text-destructive border-destructive/20' },
    };

    const { variant, label, className } = config[action as keyof typeof config] || config.UPDATE;

    return (
      <Badge variant={variant} className={`${className} font-medium border`}>
        {label}
      </Badge>
    );
  };

  const getTableLabel = (tableName: string) => {
    const labels: Record<string, string> = {
      employee_details: 'Mitarbeiter-Details',
      contact_persons: 'Kontaktpersonen',
      companies: 'Firmen',
    };

    return labels[tableName] || tableName;
  };

  const renderChanges = (oldData: any, newData: any, action: string) => {
    if (action === 'INSERT') {
      return (
        <div className="text-xs text-muted-foreground">
          Neuer Datensatz erstellt
        </div>
      );
    }

    if (action === 'DELETE') {
      return (
        <div className="text-xs text-muted-foreground">
          Datensatz gelöscht
        </div>
      );
    }

    if (action === 'UPDATE' && oldData && newData) {
      const changes: string[] = [];
      const sensitiveFields = ['ahv_number', 'iban', 'hourly_wage'];

      Object.keys(newData).forEach((key) => {
        if (oldData[key] !== newData[key] && key !== 'updated_at') {
          const isSensitive = sensitiveFields.includes(key);
          const oldValue = isSensitive ? '***' : oldData[key];
          const newValue = isSensitive ? '***' : newData[key];

          changes.push(`${key}: ${oldValue || 'leer'} → ${newValue || 'leer'}`);
        }
      });

      return (
        <div className="text-xs text-muted-foreground space-y-1">
          {changes.slice(0, 3).map((change, idx) => (
            <div key={idx}>{change}</div>
          ))}
          {changes.length > 3 && (
            <div className="text-xs text-muted-foreground/70">
              +{changes.length - 3} weitere Änderungen
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <RoleGuard requireAdmin showMessage>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Audit-Log</CardTitle>
                <CardDescription>
                  Änderungshistorie sensibler Daten
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Aktualisieren
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Select value={tableFilter} onValueChange={setTableFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tabelle wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Tabellen</SelectItem>
                <SelectItem value="employee_details">Mitarbeiter-Details</SelectItem>
                <SelectItem value="contact_persons">Kontaktpersonen</SelectItem>
              </SelectContent>
            </Select>

            <Select value={limit.toString()} onValueChange={(v) => setLimit(parseInt(v))}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Anzahl" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 Einträge</SelectItem>
                <SelectItem value="50">50 Einträge</SelectItem>
                <SelectItem value="100">100 Einträge</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Lade Audit-Logs...
              </div>
            ) : !auditLogs || auditLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                Keine Audit-Logs vorhanden
              </div>
            ) : (
              auditLogs.map((log) => (
                <Card key={log.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getActionBadge(log.action)}
                        <span className="text-sm font-medium">
                          {getTableLabel(log.table_name)}
                        </span>
                      </div>
                      {renderChanges(log.old_data, log.new_data, log.action)}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>
                          {format(new Date(log.changed_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                        </span>
                        <span>von {log.user_email}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </RoleGuard>
  );
};

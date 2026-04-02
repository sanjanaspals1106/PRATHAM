import winston from 'winston';
import { getSupabaseClient } from '../config/database';
import { AuditLog } from '../models/types';

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

export class AuditLoggerService {
  /**
   * Log a triage creation event
   */
  async logTriageCreated(
    triageId: string,
    priority: string,
    mode: string,
    operatorName?: string
  ): Promise<void> {
    try {
      const supabase = getSupabaseClient();

      const auditData = {
        action: 'TRIAGE_CREATED',
        triage_id: triageId,
        details: {
          priority,
          mode,
        },
        operator_name: operatorName || null,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('audit_logs').insert(auditData);

      if (error) {
        logger.error('Failed to log triage creation to database', { error, triageId });
      } else {
        logger.info('Triage created', { triageId, priority, mode });
      }
    } catch (error) {
      logger.error('Error logging triage creation', { error, triageId });
    }
  }

  /**
   * Log a priority override event
   */
  async logPriorityOverride(
    triageId: string,
    oldPriority: string,
    newPriority: string,
    reason: string,
    operatorName?: string
  ): Promise<void> {
    try {
      const supabase = getSupabaseClient();

      const auditData = {
        action: 'PRIORITY_OVERRIDDEN',
        triage_id: triageId,
        details: {
          oldPriority,
          newPriority,
          reason,
        },
        operator_name: operatorName || null,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('audit_logs').insert(auditData);

      if (error) {
        logger.error('Failed to log priority override to database', { error, triageId });
      } else {
        logger.warn('Priority overridden', {
          triageId,
          oldPriority,
          newPriority,
          reason,
        });
      }
    } catch (error) {
      logger.error('Error logging priority override', { error, triageId });
    }
  }

  /**
   * Log a record export event
   */
  async logRecordExport(
    recordCount: number,
    startDate?: string,
    endDate?: string,
    operatorName?: string
  ): Promise<void> {
    try {
      const supabase = getSupabaseClient();

      const auditData = {
        action: 'RECORD_EXPORTED',
        triage_id: null,
        details: {
          recordCount,
          startDate,
          endDate,
        },
        operator_name: operatorName || null,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('audit_logs').insert(auditData);

      if (error) {
        logger.error('Failed to log record export to database', { error });
      } else {
        logger.info('Records exported', { recordCount, startDate, endDate });
      }
    } catch (error) {
      logger.error('Error logging record export', { error });
    }
  }

  /**
   * Retrieve audit logs with optional filters
   */
  async getAuditLogs(params: {
    limit?: number;
    offset?: number;
    triageId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<AuditLog[]> {
    try {
      const supabase = getSupabaseClient();
      const { limit = 100, offset = 0, triageId, action, startDate, endDate } = params;

      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (triageId) {
        query = query.eq('triage_id', triageId);
      }

      if (action) {
        query = query.eq('action', action);
      }

      if (startDate) {
        query = query.gte('created_at', startDate);
      }

      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Failed to retrieve audit logs', { error });
        return [];
      }

      return (data || []).map((log) => ({
        id: log.id,
        action: log.action,
        triageId: log.triage_id,
        details: log.details,
        operatorName: log.operator_name,
        createdAt: log.created_at,
      }));
    } catch (error) {
      logger.error('Error retrieving audit logs', { error });
      return [];
    }
  }
}

export const auditLoggerService = new AuditLoggerService();
export { logger };

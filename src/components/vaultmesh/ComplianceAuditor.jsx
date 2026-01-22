import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Shield, AlertTriangle, CheckCircle, XCircle, FileText, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const RISK_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

const STATUS_ICONS = {
  passed: CheckCircle,
  failed: XCircle,
  warning: AlertTriangle,
  in_progress: Loader2
};

export default function ComplianceAuditor({ vaults }) {
  const [selectedVault, setSelectedVault] = useState('');
  const [auditType, setAuditType] = useState('Comprehensive');
  const [isAuditing, setIsAuditing] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: audits = [], isLoading } = useQuery({
    queryKey: ['compliance-audits'],
    queryFn: () => base44.entities.ComplianceAudit.list('-created_date', 50)
  });

  const createAuditMutation = useMutation({
    mutationFn: (data) => base44.entities.ComplianceAudit.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-audits'] });
    }
  });

  const runAudit = async () => {
    if (!selectedVault) {
      toast.error('Please select a vault to audit');
      return;
    }

    const vault = vaults.find(v => v.id === selectedVault);
    if (!vault) return;

    setIsAuditing(true);

    try {
      // Create initial audit record
      const initialAudit = await createAuditMutation.mutateAsync({
        vaultId: vault.id,
        vaultName: vault.name,
        auditType,
        status: 'in_progress'
      });

      // Run AI-powered compliance analysis
      const aiAnalysis = await base44.integrations.Core.InvokeLLM({
        prompt: `As a compliance auditor, analyze this vault for ${auditType} compliance:

Vault Details:
- Name: ${vault.name}
- Type: ${vault.vaultType}
- Encryption: ${vault.encryptionLevel}
- Access Level: ${vault.accessLevel}
- Region: ${vault.metadata?.region || 'Unknown'}
- Items: ${vault.metadata?.itemCount || 0}
- Status: ${vault.status}

Analyze against these regulations:
${auditType === 'POPIA' || auditType === 'Comprehensive' ? `
- POPIA (South Africa): Data minimization, consent, data residency in South Africa, breach notification, security safeguards
` : ''}
${auditType === 'GDPR' || auditType === 'Comprehensive' ? `
- GDPR (EU): Right to be forgotten, data portability, consent, encryption, audit trails
` : ''}
${auditType === 'PCI-DSS' || auditType === 'Comprehensive' ? `
- PCI-DSS: Strong encryption (AES-256+), access control, audit logging, restricted access
` : ''}

Provide:
1. List of specific violations (if any)
2. Compliance assessment for: encryption, access control, data residency, audit trail
3. Risk level (low/medium/high/critical)
4. Compliance score (0-100)
5. Actionable recommendations`,
        response_json_schema: {
          type: "object",
          properties: {
            violations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  regulation: { type: "string" },
                  severity: { type: "string" },
                  description: { type: "string" },
                  recommendation: { type: "string" }
                }
              }
            },
            encryption: {
              type: "object",
              properties: {
                compliant: { type: "boolean" },
                details: { type: "string" }
              }
            },
            accessControl: {
              type: "object",
              properties: {
                compliant: { type: "boolean" },
                details: { type: "string" }
              }
            },
            dataResidency: {
              type: "object",
              properties: {
                compliant: { type: "boolean" },
                details: { type: "string" }
              }
            },
            auditTrail: {
              type: "object",
              properties: {
                compliant: { type: "boolean" },
                details: { type: "string" }
              }
            },
            riskLevel: { type: "string" },
            complianceScore: { type: "number" },
            recommendations: {
              type: "array",
              items: { type: "string" }
            },
            summary: { type: "string" }
          }
        }
      });

      // Determine overall status
      const status = aiAnalysis.violations.length === 0 ? 'passed' :
                    aiAnalysis.riskLevel === 'critical' || aiAnalysis.riskLevel === 'high' ? 'failed' : 'warning';

      // Update audit with results
      await base44.entities.ComplianceAudit.update(initialAudit.id, {
        status,
        riskLevel: aiAnalysis.riskLevel,
        complianceScore: aiAnalysis.complianceScore,
        violations: aiAnalysis.violations,
        findings: {
          encryption: aiAnalysis.encryption,
          accessControl: aiAnalysis.accessControl,
          dataResidency: aiAnalysis.dataResidency,
          auditTrail: aiAnalysis.auditTrail
        },
        recommendations: aiAnalysis.recommendations,
        aiAnalysis: aiAnalysis.summary
      });

      queryClient.invalidateQueries({ queryKey: ['compliance-audits'] });

      if (status === 'passed') {
        toast.success(`Compliance audit passed! Score: ${aiAnalysis.complianceScore}/100`);
      } else if (status === 'warning') {
        toast.warning(`Compliance audit completed with warnings. Score: ${aiAnalysis.complianceScore}/100`);
      } else {
        toast.error(`Compliance audit failed. ${aiAnalysis.violations.length} violations found.`);
      }

    } catch (error) {
      console.error('Audit error:', error);
      toast.error('Failed to complete compliance audit');
    } finally {
      setIsAuditing(false);
    }
  };

  const stats = {
    total: audits.length,
    passed: audits.filter(a => a.status === 'passed').length,
    failed: audits.filter(a => a.status === 'failed').length,
    warnings: audits.filter(a => a.status === 'warning').length,
    avgScore: audits.length > 0 
      ? Math.round(audits.reduce((sum, a) => sum + (a.complianceScore || 0), 0) / audits.length)
      : 0
  };

  const criticalAudits = audits.filter(a => a.riskLevel === 'critical' || a.riskLevel === 'high');

  return (
    <div className="space-y-6">
      {/* Critical Alerts */}
      {criticalAudits.length > 0 && (
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="w-5 h-5" />
              Critical Compliance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalAudits.slice(0, 3).map(audit => (
                <div key={audit.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                  <div>
                    <p className="font-semibold text-red-900">{audit.vaultName}</p>
                    <p className="text-sm text-red-700">
                      {audit.violations?.length || 0} violations • Risk: {audit.riskLevel}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedAudit(audit);
                      setIsDetailsOpen(true);
                    }}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Passed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-700">{stats.passed}</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-700">{stats.warnings}</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-700">{stats.failed}</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-700">{stats.avgScore}</p>
          </CardContent>
        </Card>
      </div>

      {/* Run Audit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI-Powered Compliance Audit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Vault</label>
              <Select value={selectedVault} onValueChange={setSelectedVault}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a vault to audit" />
                </SelectTrigger>
                <SelectContent>
                  {vaults.map(vault => (
                    <SelectItem key={vault.id} value={vault.id}>
                      {vault.name} ({vault.vaultType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Audit Type</label>
              <Select value={auditType} onValueChange={setAuditType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Comprehensive">🌐 Comprehensive (All Regulations)</SelectItem>
                  <SelectItem value="POPIA">🇿🇦 POPIA (South Africa)</SelectItem>
                  <SelectItem value="GDPR">🇪🇺 GDPR (EU)</SelectItem>
                  <SelectItem value="PCI-DSS">💳 PCI-DSS (Payment)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={runAudit}
            disabled={isAuditing || !selectedVault}
            className="w-full bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700"
            size="lg"
          >
            {isAuditing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Running AI Compliance Audit...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Run Compliance Audit
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Audit History */}
      <Card>
        <CardHeader>
          <CardTitle>Audit History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {audits.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No audits run yet</p>
            ) : (
              audits.map(audit => {
                const StatusIcon = STATUS_ICONS[audit.status] || Shield;
                
                return (
                  <div key={audit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <StatusIcon className={`w-5 h-5 ${
                        audit.status === 'passed' ? 'text-green-600' :
                        audit.status === 'failed' ? 'text-red-600' :
                        audit.status === 'warning' ? 'text-yellow-600' :
                        'text-gray-400 animate-spin'
                      }`} />
                      <div>
                        <p className="font-semibold">{audit.vaultName}</p>
                        <p className="text-sm text-gray-500">
                          {audit.auditType} • {new Date(audit.created_date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {audit.complianceScore !== undefined && (
                        <div className="text-right">
                          <p className="text-2xl font-bold">{audit.complianceScore}</p>
                          <p className="text-xs text-gray-500">Score</p>
                        </div>
                      )}
                      {audit.riskLevel && (
                        <Badge className={RISK_COLORS[audit.riskLevel]}>
                          {audit.riskLevel}
                        </Badge>
                      )}
                      <Button
                        onClick={() => {
                          setSelectedAudit(audit);
                          setIsDetailsOpen(true);
                        }}
                        size="sm"
                        variant="outline"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Audit Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Compliance Audit Report: {selectedAudit?.vaultName}
            </DialogTitle>
          </DialogHeader>

          {selectedAudit && (
            <div className="space-y-6 py-4">
              {/* Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Audit Type</p>
                  <p className="font-semibold">{selectedAudit.auditType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={
                    selectedAudit.status === 'passed' ? 'bg-green-100 text-green-800' :
                    selectedAudit.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }>
                    {selectedAudit.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Risk Level</p>
                  <Badge className={RISK_COLORS[selectedAudit.riskLevel]}>
                    {selectedAudit.riskLevel}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Compliance Score</p>
                  <p className="text-2xl font-bold">{selectedAudit.complianceScore}/100</p>
                </div>
              </div>

              {/* AI Analysis */}
              {selectedAudit.aiAnalysis && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    AI Analysis
                  </h3>
                  <p className="text-sm">{selectedAudit.aiAnalysis}</p>
                </div>
              )}

              {/* Violations */}
              {selectedAudit.violations?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    Violations Found ({selectedAudit.violations.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedAudit.violations.map((violation, idx) => (
                      <div key={idx} className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-red-900">{violation.regulation}</p>
                          <Badge className="bg-red-600 text-white">{violation.severity}</Badge>
                        </div>
                        <p className="text-sm text-red-800 mb-2">{violation.description}</p>
                        <p className="text-sm text-red-700">
                          <strong>Recommendation:</strong> {violation.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Findings */}
              {selectedAudit.findings && (
                <div>
                  <h3 className="font-semibold mb-3">Compliance Findings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(selectedAudit.findings).map(([key, finding]) => (
                      <div key={key} className={`p-3 rounded-lg border ${
                        finding.compliant ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          {finding.compliant ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <p className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        </div>
                        <p className="text-sm">{finding.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {selectedAudit.recommendations?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {selectedAudit.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
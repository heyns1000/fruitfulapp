import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, Download, ChevronDown, ChevronUp, Shield, Lock, AlertTriangle } from 'lucide-react';

const NDA_CONTENT = `# RECIPROCAL CONFIDENTIALITY, NON-DISCLOSURE AND NON-COMPETE AGREEMENT

**Fruitful Holdings (Pty) Ltd** — Registration Number 2025/015799/07  
Represented by **Heyns Schoeman**, Director  
*(hereinafter the "Disclosing Party")*

---

## 1. PARTIES

This Agreement is made between the Disclosing Party and the **Recipient** (to be completed and signed).

---

## 2. DEFINITIONS

**"Confidential Information"** means all information or data in any form — oral, written, electronic or visual — relating to the Disclosing Party or its Associated Companies, including:

- Trade secrets, know-how, technical information, operating methods, and technology
- Business plans, proposals, finance and accounting information
- Pricing, price lists, purchasing policies, customer lists
- Computer data, programs, and source codes
- Intellectual property, proprietary methodologies, and formulae
- Network telecommunications information
- Contracts, products, designs, plans, and specifications

**"Permitted Purpose"** means the consideration, evaluation and negotiation of the Business Purpose.

**"Permitted Disclosees"** means Representatives of the Recipient directly involved in the Business Purpose, or any other person with prior written Disclosing Party consent.

---

## 3. INTRODUCTION

The Parties intend to enter into negotiations relating to the Business Purpose. During and after negotiations, both Parties will disclose Confidential Information to each other and agree to maintain confidentiality on the terms herein.

---

## 4. CONFIDENTIALITY UNDERTAKINGS

The Recipient **irrevocably and unconditionally** agrees to:

- Treat all Confidential Information as private, secret and confidential
- Not use Confidential Information for any purpose other than the Permitted Purpose
- Not copy, reproduce or reduce to writing any Confidential Information without prior written consent
- Not decompile, disassemble or reverse engineer any Confidential Information
- Not disclose or divulge Confidential Information to any third party without written consent
- Keep all Confidential Information safely and securely against theft, damage, loss or unauthorised access

---

## 5. PERMITTED DISCLOSEES

Disclosure permitted only on a **"need to know" basis** for the Permitted Purpose. The Recipient remains responsible for any breach by any Permitted Disclosee.

---

## 6. RETURN OF CONFIDENTIAL INFORMATION

Within **5 business days** of termination of discussions, the Recipient shall:

- Return or destroy all Confidential Information and copies
- Destroy all analyses, compilations, notes, or documents derived from Confidential Information
- Delete all Confidential Information from any computer or device
- Confirm compliance in writing to the Disclosing Party

---

## 7. EXCLUSIONS

The undertakings do **not** apply to information that:

- Is or becomes generally available to the public (not through Recipient's breach)
- The Disclosing Party confirms in writing is disclosed on a non-confidential basis
- Has lawfully become known to the Recipient from a source with legal right to disclose

---

## 8. DISCLOSURE WITHOUT BREACH

Legal compulsion to disclose does not constitute breach **provided** the Recipient immediately notifies the Disclosing Party, limits disclosure to the minimum required, and complies with all reasonable Disclosing Party requests.

---

## 9. NON-SOLICITATION (12 Months)

For **12 months** from the Date of Signature, the Recipient shall not:

- Solicit, entice or induce any employee or service provider of the Disclosing Party
- Solicit any customer, business associate, supplier, distributor or agent of the Disclosing Party
- Assist any party to restrict, vary or cease their relationship with the Disclosing Party

---

## 10. NON-COMPETE (3 Years)

For **3 years** following termination of this Agreement, the Recipient shall not directly or indirectly engage in any business activity **competitive with the existing business of the Disclosing Party**.

---

## 11. DISCLAIMER

No licence is granted under this Agreement. No agency, partnership, joint venture or other relationship is created. Neither party is obligated to enter into any business relationship.

---

## 12. BREACH

In the event of breach, the Recipient must:

- Immediately notify the Disclosing Party in writing
- Take all steps required to remedy or mitigate effects of the breach
- Use all reasonable commercial endeavours to assist in recovering Confidential Information

> *Damages alone may not be an adequate remedy. The Disclosing Party is entitled to interdict, specific performance, and any equitable relief.*

---

## 13. DURATION

Obligations commence on the date of disclosure and **continue indefinitely**, regardless of any termination of negotiations or subsequent agreements.

---

## 14. GOVERNING LAW & JURISDICTION

This Agreement is governed by the **laws of the Republic of South Africa**. Disputes shall be submitted to arbitration in **Pretoria, South Africa**, in accordance with the AFSA rules.

---

## 15. DISCLOSING PARTY DETAILS

**Fruitful Holdings (Pty) Ltd**  
302 Dykor Street, Silverton, Pretoria  
Registration Number: 2020/038051/07

---

*This is a binding legal document. By signing, the Recipient accepts all terms above in full.*
`;

export default function LegalDocuments() {
  const [activeTab, setActiveTab] = useState('nda');

  const downloadNDA = () => {
    const blob = new Blob([NDA_CONTENT], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FruitfulHoldings-NDA.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-700 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-indigo-400" />
            <h1 className="text-3xl font-black text-white">Legal Documents</h1>
          </div>
          <p className="text-slate-400">Fruitful Holdings (Pty) Ltd — Official Legal Repository</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('nda')}
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${activeTab === 'nda' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <Lock className="w-4 h-4 inline mr-2" />
            NDA Agreement
          </button>
          <button
            onClick={() => setActiveTab('license')}
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${activeTab === 'license' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            FPSL License
          </button>
        </div>

        {/* NDA Tab */}
        {activeTab === 'nda' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Reciprocal NDA & Non-Compete</h2>
                <p className="text-slate-400 text-sm mt-1">Fruitful Holdings (Pty) Ltd — South African Law — Indefinite Duration</p>
              </div>
              <button
                onClick={downloadNDA}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                Download .md
              </button>
            </div>

            <div className="bg-amber-950/30 border border-amber-700/50 rounded-xl p-4 mb-6 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-300 font-semibold text-sm">Binding Legal Document</p>
                <p className="text-amber-400/80 text-xs mt-0.5">This NDA is a binding contract governed by South African law. Non-compete clause extends 3 years post-termination. Non-solicitation covers 12 months. Consult legal counsel before signing.</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 prose prose-invert prose-sm max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-h1:text-2xl prose-h2:text-lg prose-h2:border-b prose-h2:border-slate-700 prose-h2:pb-2 prose-h2:mt-8
              prose-p:text-slate-300 prose-li:text-slate-300
              prose-strong:text-white prose-blockquote:border-indigo-500 prose-blockquote:text-indigo-300
              prose-hr:border-slate-700 prose-code:text-indigo-300">
              <ReactMarkdown>{NDA_CONTENT}</ReactMarkdown>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Disclosing Party Signature</p>
                <div className="h-12 border-b border-slate-600 mb-2" />
                <p className="text-slate-400 text-xs">FRUITFUL HOLDINGS PROPRIETARY LIMITED</p>
                <p className="text-slate-400 text-xs mt-1">Date: _______________</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Recipient Signature</p>
                <div className="h-12 border-b border-slate-600 mb-2" />
                <p className="text-slate-400 text-xs">Name: _______________</p>
                <p className="text-slate-400 text-xs mt-1">Date: _______________</p>
              </div>
            </div>
          </div>
        )}

        {/* License Tab */}
        {activeTab === 'license' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Fruitful Proprietary Source License (FPSL) v1.0</h2>
                <p className="text-slate-400 text-sm mt-1">Copyright © 2024–2026 Fruitful Holdings (Pty) Ltd & Heyns Schoeman</p>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
{`FRUITFUL PROPRIETARY SOURCE LICENSE (FPSL) v1.0
Copyright (c) 2024–2026 Fruitful Holdings (Pty) Ltd & Heyns Schoeman
All rights reserved.

────────────────────────────────────────────────────────────────────────
NOTICE: BY CLONING, FORKING, DOWNLOADING, READING, EXECUTING, DEPLOYING,
OR OTHERWISE INTERACTING WITH ANY PART OF THIS REPOSITORY — INCLUDING BUT
NOT LIMITED TO TEMPLATES, CONFIGS, WORKERS, WORKFLOWS, SCRIPTS, OR DOCS —
YOU ACCEPT THE FULL TERMS OF THIS LICENSE WITH IMMEDIATE EFFECT.
NO FURTHER AGREEMENT IS REQUIRED. IGNORANCE OF THESE TERMS IS NOT A DEFENCE.
────────────────────────────────────────────────────────────────────────

1. GRANT OF RIGHTS
   No rights are granted by default. Use of the Work in any form requires
   prior written authorisation from Fruitful Holdings (Pty) Ltd.
   Authorised use is limited to:
   a) Internal evaluation by the named licensee;
   b) Contribution back to this repository under Fruitful Holdings review;
   c) Deployment within the Fruitful Ecosystem (*.faa.zone, *.seedwave.faa.zone)
      by authorised operators only.

2. RESTRICTIONS
   You may NOT, without explicit written permission:
   a) Redistribute, sublicense, sell, rent, or transfer the Work;
   b) Use the Work or any derivative in a competing product or service;
   c) Remove or alter this license, any copyright notice, or the
      fruitful-banner.png attribution;
   d) Deploy worker, DNS, or routing configurations outside the Fruitful Ecosystem;
   e) Use the seedwave domain structure or loadBrandConfig pattern commercially
      without a separate commercial licence.

3. BANNER & ATTRIBUTION REQUIREMENT
   All repositories and deployments must include the fruitful-banner.png asset.
   Removal constitutes a material breach.

4. NO WARRANTY
   THE WORK IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.

5. LIMITATION OF LIABILITY
   FRUITFUL HOLDINGS SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
   SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM USE OR INABILITY
   TO USE THE WORK — INCLUDING LOSS OF DATA, REVENUE, PROFIT, OR DNS ISSUES.
   THIS LIMITATION TAKES EFFECT FROM THE MOMENT YOU FIRST INTERACT WITH THE WORK.

6. GOVERNING LAW
   Governed by the laws of the Republic of South Africa.
   Disputes resolved in the courts of Gauteng, South Africa.

7. CONTACT
   vault@faa.zone | https://faa.zone
   Fruitful Holdings (Pty) Ltd — Willow Acres Estate, Gauteng, ZA

────────────────────────────────────────────────────────────────────────
Applies to all repositories under:
  github.com/Fruitful-Global-Planet/*  |  github.com/heyns1000/*
Including: banimal-global-loop, zoho, codenest, vaultmesh, seedwave
────────────────────────────────────────────────────────────────────────

GC7:FSP2021121654:4400302974:VM9s:BL1501:GHOST7CHAIN:FAA13713`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
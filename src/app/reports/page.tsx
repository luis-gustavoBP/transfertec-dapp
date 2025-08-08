'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function ReportsPage() {
  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatórios</h1>
        <p className="text-gray-600">Acompanhe métricas do marketplace e das pesquisas cadastradas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">27</div>
            <div className="text-sm text-gray-600">Tecnologias Cadastradas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-600 mb-2">14</div>
            <div className="text-sm text-gray-600">Licenças Emitidas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">4.12 ETH</div>
            <div className="text-sm text-gray-600">Receita Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-yellow-600 mb-2">5</div>
            <div className="text-sm text-gray-600">Pesquisas Pendentes</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Tecnologias Recentes</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[{ name: 'Sistema Solar Híbrido', cat: 'Energia Solar' }, { name: 'Biodigestor Compacto', cat: 'Biomassa' }, { name: 'Sensor IoT', cat: 'Agricultura' }].map((t, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="text-sm text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-600">{t.cat}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Licenças por Categoria</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[{ label: 'Solar', pct: 40 }, { label: 'Biomassa', pct: 30 }, { label: 'Eólica', pct: 20 }, { label: 'Outros', pct: 10 }].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="text-gray-900 font-medium">{item.pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-primary-600 rounded-full" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[{ a: 'Licença emitida', d: 'Sistema Solar Híbrido', t: '2h' }, { a: 'Nova tecnologia', d: 'Biodigestor Compacto', t: '6h' }, { a: 'Royalty pago', d: 'Sensor IoT', t: '1d' }].map((x, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="text-gray-900">{x.a}: <span className="font-medium">{x.d}</span></div>
                <div className="text-gray-500">{x.t} atrás</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

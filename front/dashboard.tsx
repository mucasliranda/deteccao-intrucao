'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, FileText, Activity, Globe } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import TrafficChart from './TrafficChart'

interface Anomaly {
  id: number
  description: string
  severity: string
  ip: string
}

interface ShodanResult {
  ip: string
  country: string
  city: string
  isp: string
  open_ports: number[]
}

const anomalies: Anomaly[] = [
  { id: 1, description: 'Tráfego anormal detectado na porta 443', severity: 'Alta', ip: '46.151.81.3' },
  { id: 2, description: 'Múltiplas tentativas de login falhadas', severity: 'Média', ip: '10.0.0.5' },
  { id: 3, description: 'Software desatualizado', severity: 'Baixa', ip: '172.16.0.1' },
]

export default function Dashboard() {
  const [shodanResults, setShodanResults] = useState<ShodanResult | null>(null)
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null)

  useEffect(() => {
    if (selectedAnomaly) {
      handleShodanSearch(selectedAnomaly.ip)
    }
  }, [selectedAnomaly])

  const handleShodanSearch = async (ip: string) => {
    // Simulates a SHODAN search - replace with a real API call
    console.log('Pesquisando no SHODAN:', ip)
    // Simulates a SHODAN result
    const mockResult: ShodanResult = {
      ip: '46.151.81.3',
      country: 'Ukraine',
      city: 'Kyiv',
      isp: 'Zhilynsky Pavel Vladimirovich',
      open_ports: [21, 25, 53, 80, 110, 135, 143, 443, 3306, 3389, 8443, 8880]
    }
    setShodanResults(mockResult)
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    
    doc.text('Relatório de Detecção de Intrusão', 14, 15)
    
    // Adds information about anomalies
    doc.text('Anomalias Detectadas:', 14, 25)
    const anomalyData = anomalies.map(a => [a.id, a.description, a.severity, a.ip])
    doc.autoTable({
      startY: 30,
      head: [['ID', 'Descrição', 'Severidade', 'IP']],
      body: anomalyData,
    })
    
    // Adds SHODAN information if available
    if (shodanResults) {
      const lastTable = doc.lastAutoTable
      if (lastTable) {
        doc.text('Informações do SHODAN:', 14, lastTable.finalY + 10)
        doc.text(`IP: ${shodanResults.ip}`, 14, lastTable.finalY + 20)
        doc.text(`País: ${shodanResults.country}`, 14, lastTable.finalY + 30)
        doc.text(`Cidade: ${shodanResults.city}`, 14, lastTable.finalY + 40)
        doc.text(`ISP: ${shodanResults.isp}`, 14, lastTable.finalY + 50)
        doc.text(`Portas abertas: ${shodanResults.open_ports.join(', ')}`, 14, lastTable.finalY + 60)
      }
    }
    
    doc.save('relatorio-deteccao-intrusao.pdf')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Sistema de Detecção de Intrusão</h1>
      
      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="traffic">Tráfego de Rede</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalias</TabsTrigger>
          <TabsTrigger value="shodan">SHODAN</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic">
          <TrafficChart />
        </TabsContent>

        <TabsContent value="anomalies">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Anomalias</CardTitle>
              <CardDescription>Anomalias detectadas recentemente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anomalies.map((anomaly) => (
                  <Alert 
                    key={anomaly.id} 
                    variant={anomaly.severity === 'Alta' ? 'destructive' : 'default'}
                    className="cursor-pointer"
                    onClick={() => setSelectedAnomaly(anomaly)}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Severidade: {anomaly.severity}</AlertTitle>
                    <AlertDescription>
                      {anomaly.description}
                      <br />
                      <strong>IP: {anomaly.ip}</strong>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shodan">
          <Card>
            <CardHeader>
              <CardTitle>Informações do SHODAN</CardTitle>
              <CardDescription>Detalhes do IP anômalo selecionado</CardDescription>
            </CardHeader>
            <CardContent>
              {shodanResults ? (
                <div>
                  <p><strong>IP:</strong> {shodanResults.ip}</p>
                  <p><strong>País:</strong> {shodanResults.country}</p>
                  <p><strong>Cidade:</strong> {shodanResults.city}</p>
                  <p><strong>ISP:</strong> {shodanResults.isp}</p>
                  <p><strong>Portas abertas:</strong> {shodanResults.open_ports.join(', ')}</p>
                </div>
              ) : (
                <p>Selecione uma anomalia para ver as informações do SHODAN</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas de Tráfego</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Tráfego total hoje: 15.67 GB</span>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Globe className="h-4 w-4" />
              <span>IPs únicos: 1,234</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Button onClick={generatePDF}>
          <FileText className="mr-2 h-4 w-4" /> Gerar Relatório PDF
        </Button>
      </div>
    </div>
  )
}
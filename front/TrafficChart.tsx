'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

const generateRandomTraffic = () => {
  return days.map(day => ({
    name: day,
    value: Math.floor(Math.random() * 5000) + 1000, // Values between 1000 and 6000
  }))
}

export default function TrafficChart() {
  const [trafficData, setTrafficData] = useState(generateRandomTraffic())

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficData(generateRandomTraffic())
    }, 5000) // Updates every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualização de Tráfego de Rede</CardTitle>
        <CardDescription>Tráfego de rede simulado (atualiza a cada 5 segundos)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trafficData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
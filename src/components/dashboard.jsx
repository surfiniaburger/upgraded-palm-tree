"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Brain, Activity, TrendingUp, AlertCircle, Search, Users, RefreshCcw, MessageSquare } from 'lucide-react';

// Enhanced data generation with more metrics
const generatePatientData = (patientCount = 100) => {
  return Array.from({ length: patientCount }, (_, id) => ({
    id: `P${id + 1}`,
    age: Math.floor(Math.random() * 50 + 20),
    gender: Math.random() > 0.5 ? 'M' : 'F',
    a1cHistory: Array.from({ length: 6 }, () => +(Math.random() * 2 + 6).toFixed(1)),
    glucoseReadings: Array.from({ length: 30 }, () => Math.floor(Math.random() * 150 + 70)),
    medicationAdherence: Math.floor(Math.random() * 40 + 60),
    riskScore: Math.floor(Math.random() * 100),
    complications: Math.random() > 0.7 ? ['retinopathy'] : [],
    lastVisit: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

// Simulated Gemini API response
 const getGeminiInsights = async (patientData) => {
  // In a real implementation, this would call the Gemini API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        summary: "Based on the recent data patterns, there's a 92% chance of maintaining stable glucose levels with current treatment. Consider reviewing diet plans for optimal results.",
        recommendations: [
          "Increase monitoring frequency during evening hours",
          "Schedule follow-up for medication adjustment",
          "Review exercise routine impact on glucose levels"
        ],
        riskFactors: [
          { factor: "Evening glucose spikes", severity: "medium" },
          { factor: "Irregular medication timing", severity: "low" },
          { factor: "Exercise pattern variability", severity: "low" }
        ]
      });
    }, 1000);
  });
};

const AnomalyDetection = ({ data }) => {
  const anomalies = data.filter(reading => reading > 180 || reading < 70);
  return (
    <Alert className={anomalies.length > 0 ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"}>
      <AlertDescription>
        {anomalies.length > 0 
          ? `Detected ${anomalies.length} anomalous readings. Review recommended.`
          : "No significant anomalies detected in recent readings."}
      </AlertDescription>
    </Alert>
  );
};

export default function DiabetesDashboard() {
  const [timeframe, setTimeframe] = useState('6m');
  const [patientFilter, setPatientFilter] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPatients(generatePatientData());
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      setLoading(true);
      getGeminiInsights(selectedPatient)
        .then(setInsights)
        .finally(() => setLoading(false));
    }
  }, [selectedPatient]);

  const filteredPatients = patients.filter(p => 
    p.id.toLowerCase().includes(patientFilter.toLowerCase())
  );

  const StatCard = ({ title, value, icon, trend, onClick }) => (
    <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            {trend && (
              <p className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${trend > 0 ? 'bg-green-100' : 'bg-blue-100'}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">AI-Enhanced Diabetes Management 🤖</h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Search className="text-gray-400" />
            <Input 
              placeholder="Search patients..."
              value={patientFilter}
              onChange={(e) => setPatientFilter(e.target.value)}
              className="w-48"
            />
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedPatient && (
        <Alert className="bg-purple-50 border-purple-200">
          <div className="flex justify-between items-center">
            <AlertDescription>
              Viewing data for Patient {selectedPatient.id} | 
              Age: {selectedPatient.age} | 
              Last Visit: {new Date(selectedPatient.lastVisit).toLocaleDateString()}
            </AlertDescription>
            <Button variant="outline" onClick={() => setSelectedPatient(null)}>
              Clear Selection
            </Button>
          </div>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="AI Prediction Accuracy"
          value="94.5%"
          icon={<Brain className="text-purple-500" />}
          trend={15}
        />
        <StatCard 
          title="Average A1C"
          value={selectedPatient ? 
            (selectedPatient.a1cHistory.reduce((a, b) => a + b, 0) / selectedPatient.a1cHistory.length).toFixed(1) + '%' : 
            "6.8%"}
          icon={<Activity className="text-blue-500" />}
          trend={-8}
        />
        <StatCard 
          title="Active Patients"
          value={patients.length}
          icon={<Users className="text-green-500" />}
        />
        <StatCard 
          title="Risk Score"
          value={selectedPatient ? 
            selectedPatient.riskScore + '/100' : 
            "Low"}
          icon={<AlertCircle className="text-yellow-500" />}
          trend={-25}
        />
      </div>

      {insights && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="text-purple-500" />
              Gemini AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">{insights.summary}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Recommendations:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {insights.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-gray-600">{rec}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Risk Factors:</h4>
                <ul className="space-y-2">
                  {insights.riskFactors.map((risk, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        risk.severity === 'high' ? 'bg-red-500' :
                        risk.severity === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      <span className="text-sm text-gray-600">{risk.factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Glucose Patterns & Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={selectedPatient?.glucoseReadings.map((value, index) => ({
                time: index,
                value,
                predicted: value + (Math.random() - 0.5) * 20
              })) || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[60, 200]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="AI Predicted" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
            {selectedPatient && (
              <AnomalyDetection data={selectedPatient.glucoseReadings} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Population Health Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid />
                <XAxis type="number" dataKey="age" name="Age" />
                <YAxis type="number" dataKey="riskScore" name="Risk Score" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter
                  name="Patients"
                  data={patients}
                  fill="#8884d8"
                  onClick={(data) => setSelectedPatient(data)}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={[{
                'glucose_control': selectedPatient?.glucoseReadings.slice(-1)[0] || 80,
                'medication_adherence': selectedPatient?.medicationAdherence || 75,
                'appointment_attendance': 90,
                'lifestyle_score': 85,
                'complication_risk': selectedPatient?.riskScore || 30
              }]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  name="Patient Metrics"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Patients</CardTitle>
            <Button variant="outline" size="sm">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredPatients.slice(0, 5).map(patient => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div>
                    <p className="font-medium">{patient.id}</p>
                    <p className="text-sm text-gray-500">
                      Last A1C: {patient.a1cHistory.slice(-1)[0]}%
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-sm ${
                    patient.riskScore > 70 ? 'bg-red-100 text-red-700' :
                    patient.riskScore > 30 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    Risk: {patient.riskScore}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


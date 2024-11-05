"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, FileText, Shield, ArrowUp, ArrowDown } from "lucide-react";

const StatCard = ({ title, value, icon, trend, loading }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-[100px]" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{value}</div>
            {trend && (
              <div className={`flex items-center ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend > 0 ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                <span className="ml-1">{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const [recordStats, setRecordStats] = useState(null);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [privacyData, setPrivacyData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRecordStats = async () => {
    try {
      const response = await fetch('/api/records/stats');
      setRecordStats(await response.json());
    } catch (error) {
      console.error('Error fetching record stats:', error);
    }
  };

  const fetchDiagnosisData = async () => {
    try {
      const response = await fetch('/api/diagnosis/stats');
      setDiagnosisData(await response.json());
    } catch (error) {
      console.error('Error fetching diagnosis data:', error);
    }
  };

  const fetchPrivacyData = async () => {
    try {
      const response = await fetch('/api/privacy/verification');
      setPrivacyData(await response.json());
    } catch (error) {
      console.error('Error fetching privacy data:', error);
    }
  };

  useEffect(() => {
    Promise.all([
      fetchRecordStats(),
      fetchDiagnosisData(),
      fetchPrivacyData()
    ]).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview 📊</h1>
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full animate-pulse">
          Live Updates 🔄
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Records 📝"
          value={recordStats?.total || 0}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          trend={12}
          loading={loading}
        />
        <StatCard
          title="Active Diagnoses 🏥"
          value={diagnosisData?.active || 0}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          trend={-5}
          loading={loading}
        />
        <StatCard
          title="Privacy Score 🔒"
          value={`${privacyData?.score || 0}%`}
          icon={<Shield className="h-4 w-4 text-muted-foreground" />}
          trend={8}
          loading={loading}
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Detailed Statistics 📈</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recordStats && Object.entries(recordStats).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                  <span className="capitalize text-sm font-medium">{key}</span>
                  <span className="font-mono">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>System Status 🚦</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-green-500 bg-green-50">
                <AlertDescription>
                  All systems operational ✨
                </AlertDescription>
              </Alert>
              <div className="flex justify-between items-center">
                <span>Privacy Compliance</span>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600"
                    style={{ width: `${privacyData?.score || 0}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
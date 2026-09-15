import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Activity, Globe, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';
import { localEntities } from '@/lib/localStore';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(160, 55%, 35%)', 'hsl(200, 60%, 45%)', 'hsl(36, 85%, 55%)', 'hsl(0, 72%, 51%)', 'hsl(280, 50%, 50%)'];

export default function Insights() {
  const { lang } = useLanguage();

  const { data: symptomLogs = [] } = useQuery({
    queryKey: ['symptomLogs'],
    queryFn: () => localEntities.SymptomLog.list('-created_date', 500),
  });

  const { data: topicViews = [] } = useQuery({
    queryKey: ['topicViews'],
    queryFn: () => localEntities.TopicView.list('-created_date', 500),
  });

  // Compute stats
  const totalChecks = symptomLogs.length;

  // Top symptoms
  const symptomCounts = {};
  symptomLogs.forEach(log => {
    (log.symptoms || []).forEach(s => {
      symptomCounts[s] = (symptomCounts[s] || 0) + 1;
    });
  });
  const topSymptoms = Object.entries(symptomCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, count]) => ({ name: name.replace(/([A-Z])/g, ' $1').trim(), count }));

  // Language usage
  const langCounts = {};
  symptomLogs.forEach(log => {
    const l = log.language || 'en';
    langCounts[l] = (langCounts[l] || 0) + 1;
  });
  topicViews.forEach(v => {
    const l = v.language || 'en';
    langCounts[l] = (langCounts[l] || 0) + 1;
  });
  const langLabels = { en: 'English', am: 'አማርኛ', om: 'Afaan Oromo' };
  const langData = Object.entries(langCounts).map(([code, count]) => ({
    name: langLabels[code] || code,
    value: count,
  }));

  // Risk distribution
  const riskCounts = { mild: 0, moderate: 0, severe: 0 };
  symptomLogs.forEach(log => {
    if (log.risk_level) riskCounts[log.risk_level]++;
  });
  const riskData = Object.entries(riskCounts).map(([name, value]) => ({ name, value }));
  const riskColors = { mild: '#22c55e', moderate: '#f59e0b', severe: '#ef4444' };

  // Top topics
  const topicCounts = {};
  topicViews.forEach(v => {
    topicCounts[v.topic_name] = (topicCounts[v.topic_name] || 0) + 1;
  });
  const topTopics = Object.entries(topicCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{t(lang, 'insights.title')}</h1>
        <p className="text-muted-foreground">{t(lang, 'insights.subtitle')}</p>
        <p className="text-xs text-muted-foreground mt-2">
          {lang === 'am'
            ? 'ማስታወሻ፦ ይህ መረጃ በዚህ መሣሪያ ላይ ብቻ የተከማቸ ነው።'
            : lang === 'om'
            ? "Hubachiisa: Odeeffannoon kun meeshaa kana qofa irratti kuufameera."
            : 'Note: this data is stored only on this device, not shared across users.'}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold">{totalChecks}</p>
            <p className="text-sm text-muted-foreground">{t(lang, 'insights.totalChecks')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold">{Object.keys(langCounts).length}</p>
            <p className="text-sm text-muted-foreground">{t(lang, 'insights.languageUsage')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold">{topicViews.length}</p>
            <p className="text-sm text-muted-foreground">{t(lang, 'insights.topicsViewed')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Symptoms */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t(lang, 'insights.topSymptoms')}</CardTitle>
          </CardHeader>
          <CardContent>
            {topSymptoms.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topSymptoms} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(160, 55%, 35%)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t(lang, 'insights.riskDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            {symptomLogs.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value})`}
                  >
                    {riskData.map((entry) => (
                      <Cell key={entry.name} fill={riskColors[entry.name] || COLORS[0]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Language Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t(lang, 'insights.languageUsage')}</CardTitle>
          </CardHeader>
          <CardContent>
            {langData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={langData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {langData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Top Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t(lang, 'insights.topicsViewed')}</CardTitle>
          </CardHeader>
          <CardContent>
            {topTopics.length > 0 ? (
              <div className="space-y-3">
                {topTopics.map((topic, i) => (
                  <div key={topic.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-primary/10 text-primary">
                        {i + 1}
                      </span>
                      <span className="font-medium text-sm">{topic.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{topic.count} views</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

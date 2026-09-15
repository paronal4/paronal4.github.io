import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, ArrowRight, RotateCcw, AlertTriangle, CheckCircle, AlertCircle, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';
import { calculateRiskScore, getConditionHints, nextSteps } from '@/lib/healthData';
import { localEntities } from '@/lib/localStore';
import { motion, AnimatePresence } from 'framer-motion';
import NearbyFacilitiesMap from '@/components/map/NearbyFacilitiesMap';

const symptomKeys = [
  'fever', 'cough', 'headache', 'bodyPain', 'fatigue', 'nausea',
  'diarrhea', 'rash', 'breathingDifficulty', 'chestPain', 'soreThroat',
  'runnyNose', 'abdominalPain', 'dizziness', 'lossOfAppetite',
];

const riskIcons = {
  mild: CheckCircle,
  moderate: AlertTriangle,
  severe: AlertCircle,
};

const riskBg = {
  mild: 'bg-green-50 border-green-200',
  moderate: 'bg-amber-50 border-amber-200',
  severe: 'bg-red-50 border-red-200',
};

const riskIconColor = {
  mild: 'text-green-600',
  moderate: 'text-amber-600',
  severe: 'text-red-600',
};

export default function SymptomChecker() {
  const { lang } = useLanguage();
  const [step, setStep] = useState(0); // 0=symptoms, 1=duration, 2=severity, 3=results
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [duration, setDuration] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [result, setResult] = useState(null);

  const toggleSymptom = (key) => {
    setSelectedSymptoms(prev =>
      prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]
    );
  };

  const handleGetGuidance = async () => {
    const risk = calculateRiskScore(selectedSymptoms, duration, severity);
    const conditions = getConditionHints(selectedSymptoms, lang);
    const steps = (nextSteps[lang] || nextSteps.en)[risk.level];

    const resultData = { ...risk, conditions, steps };
    setResult(resultData);
    setStep(3);

    // Log anonymously, locally on this device
    try {
      await localEntities.SymptomLog.create({
        symptoms: selectedSymptoms,
        severity_score: risk.score,
        risk_level: risk.level,
        duration_days: [0.5, 2, 5, 10][duration] || 1,
        language: lang,
        guidance_given: risk.level,
      });
    } catch (e) {
      // Silent fail for logging
    }
  };

  const reset = () => {
    setStep(0);
    setSelectedSymptoms([]);
    setDuration(null);
    setSeverity(null);
    setResult(null);
  };

  const symptoms = t(lang, 'symptom.symptoms');
  const durationOpts = t(lang, 'symptom.durationOptions');
  const severityOpts = t(lang, 'symptom.severityOptions');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{t(lang, 'symptom.title')}</h1>
        <p className="text-muted-foreground">{t(lang, 'symptom.subtitle')}</p>
      </div>

      {/* Progress indicator */}
      <div className="flex gap-2 mb-8">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Symptoms */}
        {step === 0 && (
          <motion.div
            key="symptoms"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t(lang, 'symptom.selectSymptoms')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {symptomKeys.map(key => (
                    <button
                      key={key}
                      onClick={() => toggleSymptom(key)}
                      className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all border-2 ${
                        selectedSymptoms.includes(key)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card hover:bg-muted border-border'
                      }`}
                    >
                      {symptoms[key]}
                    </button>
                  ))}
                </div>
                <Button
                  className="w-full mt-6 gap-2"
                  size="lg"
                  disabled={selectedSymptoms.length === 0}
                  onClick={() => setStep(1)}
                >
                  {t(lang, 'symptom.checkBtn')} <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 1: Duration */}
        {step === 1 && (
          <motion.div
            key="duration"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t(lang, 'symptom.duration')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {durationOpts.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => { setDuration(i); setStep(2); }}
                    className={`w-full px-4 py-4 rounded-xl text-left font-medium transition-all border-2 ${
                      duration === i
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card hover:bg-muted border-border'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Severity */}
        {step === 2 && (
          <motion.div
            key="severity"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t(lang, 'symptom.severity')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {severityOpts.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => { setSeverity(i); }}
                    className={`w-full px-4 py-4 rounded-xl text-left font-medium transition-all border-2 ${
                      severity === i
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card hover:bg-muted border-border'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
                <Button
                  className="w-full mt-4 gap-2"
                  size="lg"
                  disabled={severity === null}
                  onClick={handleGetGuidance}
                >
                  {t(lang, 'symptom.checkBtn')} <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Results */}
        {step === 3 && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <Card className={`border-2 ${riskBg[result.level]}`}>
              <CardContent className="p-6 text-center">
                {React.createElement(riskIcons[result.level], {
                  className: `h-16 w-16 mx-auto mb-4 ${riskIconColor[result.level]}`,
                })}
                <h2 className="text-2xl font-bold mb-2">
                  {t(lang, `symptom.riskLevels.${result.level}.label`)}
                </h2>
                <p className="text-base leading-relaxed">
                  {t(lang, `symptom.riskLevels.${result.level}.advice`)}
                </p>
              </CardContent>
            </Card>

            {result.conditions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t(lang, 'symptom.possibleConditions')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.conditions.map((c, i) => (
                      <Badge key={i} variant="secondary" className="text-sm px-3 py-1">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t(lang, 'symptom.nextSteps')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.steps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Nearby facilities map */}
            <div>
              <h3 className="font-bold text-base mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {lang === 'am' ? 'ቅርብ የጤና ማዕከሎች' : lang === 'om' ? 'Buufataalee Fayyaa Dhiyoo' : 'Nearby Health Facilities'}
              </h3>
              <NearbyFacilitiesMap riskLevel={result.level} />
            </div>

            <Button onClick={reset} variant="outline" className="w-full gap-2" size="lg">
              <RotateCcw className="h-4 w-4" />
              {t(lang, 'symptom.resetBtn')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

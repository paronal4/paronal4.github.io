import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, BookOpen, Heart, Globe, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';
import { motion } from 'framer-motion';

const iconMap = {
  Stethoscope,
  BookOpen,
  Heart,
  Globe,
};

export default function Home() {
  const { lang } = useLanguage();
  const features = t(lang, 'home.features');

  return (
    <div className="space-y-16">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center pt-8 sm:pt-16"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Shield className="h-4 w-4" />
          Educational Decision-Support Tool
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
          {t(lang, 'home.hero')}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          {t(lang, 'home.heroSub')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/symptom-checker">
            <Button size="lg" className="gap-2 text-base px-8">
              <Stethoscope className="h-5 w-5" />
              {t(lang, 'home.startBtn')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/education">
            <Button size="lg" variant="outline" className="gap-2 text-base px-8">
              <BookOpen className="h-5 w-5" />
              {t(lang, 'home.learnBtn')}
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Features */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, i) => {
          const Icon = iconMap[feature.icon] || Heart;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </section>

      {/* Language showcase */}
      <section className="text-center bg-card rounded-3xl border p-8 sm:p-12">
        <Globe className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-3">🇪🇹 {t(lang, 'home.offlineNote')}</h2>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <span className="px-4 py-2 bg-primary/10 rounded-full text-sm font-medium">English</span>
          <span className="px-4 py-2 bg-primary/10 rounded-full text-sm font-medium">አማርኛ (Amharic)</span>
          <span className="px-4 py-2 bg-primary/10 rounded-full text-sm font-medium">Afaan Oromo</span>
        </div>
      </section>
    </div>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Baby, Droplets, Cross, Apple, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';
import { communityGuideContent } from '@/lib/healthData';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap = { Baby, Droplets, Cross, Apple };
const sectionColors = {
  pregnancy: 'bg-pink-100 text-pink-700',
  hydration: 'bg-blue-100 text-blue-700',
  firstAid: 'bg-amber-100 text-amber-700',
  nutrition: 'bg-green-100 text-green-700',
};

const sectionKeys = ['pregnancy', 'hydration', 'firstAid', 'nutrition'];

export default function CommunityGuide() {
  const { lang } = useLanguage();
  const [selectedSection, setSelectedSection] = useState(null);
  const sections = t(lang, 'guide.sections');
  const guideContent = communityGuideContent[lang] || communityGuideContent.en;

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Users className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{t(lang, 'guide.title')}</h1>
        <p className="text-muted-foreground">{t(lang, 'guide.subtitle')}</p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedSection ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {sectionKeys.map((key) => {
              const section = sections[key];
              if (!section) return null;
              const Icon = iconMap[section.icon] || Users;
              return (
                <Card
                  key={key}
                  className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/30"
                  onClick={() => setSelectedSection(key)}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${sectionColors[key]}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-xl">{section.title}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Button
              variant="ghost"
              className="gap-2 mb-6"
              onClick={() => setSelectedSection(null)}
            >
              <ArrowLeft className="h-4 w-4" />
              {t(lang, 'guide.title')}
            </Button>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {guideContent[selectedSection]?.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>
                    {guideContent[selectedSection]?.content}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

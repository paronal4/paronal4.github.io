import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, ArrowLeft, ShieldCheck, Utensils, Cross, Bug } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';
import { educationTopics } from '@/lib/healthData';
import { localEntities } from '@/lib/localStore';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

const categoryIcons = {
  disease: Bug,
  prevention: ShieldCheck,
  first_aid: Cross,
  nutrition: Utensils,
};

const categoryColors = {
  disease: 'bg-red-100 text-red-700',
  prevention: 'bg-blue-100 text-blue-700',
  first_aid: 'bg-amber-100 text-amber-700',
  nutrition: 'bg-green-100 text-green-700',
};

export default function Education() {
  const { lang } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const topics = educationTopics[lang] || educationTopics.en;
  const categories = t(lang, 'education.categories');

  const filteredTopics = activeCategory === 'all'
    ? topics
    : topics.filter(tp => tp.category === activeCategory);

  const handleTopicClick = async (topic) => {
    setSelectedTopic(topic);
    try {
      await localEntities.TopicView.create({
        topic_id: topic.id,
        topic_name: topic.title,
        category: topic.category,
        language: lang,
      });
    } catch (e) { /* silent */ }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{t(lang, 'education.title')}</h1>
        <p className="text-muted-foreground">{t(lang, 'education.subtitle')}</p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedTopic ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
              <TabsList className="flex-wrap h-auto gap-1">
                <TabsTrigger value="all">All</TabsTrigger>
                {Object.entries(categories).map(([key, label]) => (
                  <TabsTrigger key={key} value={key}>{label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="grid sm:grid-cols-2 gap-4">
              {filteredTopics.map((topic) => {
                const Icon = categoryIcons[topic.category] || BookOpen;
                return (
                  <Card
                    key={topic.id}
                    className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/30"
                    onClick={() => handleTopicClick(topic)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${categoryColors[topic.category]}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-lg mb-1">{topic.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{topic.summary}</p>
                          <Badge variant="secondary" className="mt-3 text-xs">
                            {categories[topic.category]}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
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
              onClick={() => setSelectedTopic(null)}
            >
              <ArrowLeft className="h-4 w-4" />
              {t(lang, 'education.title')}
            </Button>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={categoryColors[selectedTopic.category]}>
                    {categories[selectedTopic.category]}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{selectedTopic.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{selectedTopic.content}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

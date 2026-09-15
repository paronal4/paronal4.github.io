import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Star, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';
import { localEntities } from '@/lib/localStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function FeedbackPage() {
  const { lang } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feature, setFeature] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    await localEntities.Feedback.create({
      rating,
      feature: feature || 'general',
      comment,
      language: lang,
    });
    setLoading(false);
    setSubmitted(true);
  };

  const featureOptions = [
    { value: 'symptom_checker', label: t(lang, 'nav.symptomChecker') },
    { value: 'education', label: t(lang, 'nav.education') },
    { value: 'community_guide', label: t(lang, 'nav.communityGuide') },
    { value: 'general', label: 'General' },
  ];

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{t(lang, 'feedback.title')}</h1>
        <p className="text-muted-foreground">{t(lang, 'feedback.subtitle')}</p>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    {t(lang, 'feedback.rateExperience')}
                  </label>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        onClick={() => setRating(i)}
                        onMouseEnter={() => setHoveredRating(i)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-10 w-10 ${
                            i <= (hoveredRating || rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feature select */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t(lang, 'feedback.selectFeature')}
                  </label>
                  <Select value={feature} onValueChange={setFeature}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {featureOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t(lang, 'feedback.comment')}
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t(lang, 'feedback.commentPlaceholder')}
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={rating === 0 || loading}
                  className="w-full gap-2"
                  size="lg"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {t(lang, 'feedback.submitBtn')}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">{t(lang, 'feedback.thankYou')}</h2>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

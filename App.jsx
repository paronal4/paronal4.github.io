import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from '@/lib/PageNotFound';
import { LanguageProvider } from '@/lib/LanguageContext';
import AppLayout from '@/components/layout/AppLayout';
import Home from '@/pages/Home';
import SymptomChecker from '@/pages/SymptomChecker';
import Education from '@/pages/Education';
import CommunityGuide from '@/pages/CommunityGuide';
import Insights from '@/pages/Insights';
import FeedbackPage from '@/pages/FeedbackPage';

function App() {
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/education" element={<Education />} />
              <Route path="/community-guide" element={<CommunityGuide />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/feedback" element={<FeedbackPage />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </LanguageProvider>
  )
}

export default App

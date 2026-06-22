/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { UserRole, ViewState } from './types';
import AdminDashboard from './AdminDashboard';
import ServiceScheduler from './components/ServiceScheduler';
import VehicleRegistration from './components/VehicleRegistration';
import { Button } from './components/ui';

// Layout & Sections
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SectionHeading } from './components/layout/SectionHeading';
import { Hero } from './components/sections/Hero';
import { Services } from './components/sections/Services';
import { WorkshopManifesto } from './components/sections/WorkshopManifesto';
import { WorkshopGallery } from './components/sections/WorkshopGallery';
import { Contact } from './components/sections/Contact';

// Auth & Client
import { AuthModal } from './components/auth/AuthModal';
import { ClientDashboard } from './components/client/ClientDashboard';
import { MechanicDashboard } from './components/mechanic/MechanicDashboard';

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [hasRedirected, setHasRedirected] = useState(false);
  const { profile, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!profile) {
        if (currentView !== 'landing') setCurrentView('landing');
        setHasRedirected(false);
      } else if (profile && !hasRedirected) {
        if (profile.role === UserRole.ADMIN) {
          setCurrentView('admin');
        } else if (profile.role === UserRole.MECHANIC) {
          setCurrentView('mechanic');
        } else {
          setCurrentView('client');
        }
        setHasRedirected(true);
      }
    }
  }, [profile, loading, currentView, hasRedirected]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <Car className="w-12 h-12 text-[#F27D26]" />
          <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-white/20">Vellux Motors</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505]">
      <Navbar onLoginClick={() => setIsAuthModalOpen(true)} setView={setCurrentView} />
      
      <main className="min-h-screen">
        < AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero onAuthClick={() => setIsAuthModalOpen(true)} />
              <Services />
              <WorkshopManifesto />
              <WorkshopGallery />
              <Contact onAuthClick={() => setIsAuthModalOpen(true)} />
            </motion.div>
          )}

          {currentView === 'admin' && profile && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AdminDashboard />
            </motion.div>
          )}

          {currentView === 'mechanic' && profile && (
            <motion.div
              key="mechanic"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-24 md:py-32 px-6 max-w-5xl mx-auto"
            >
              <MechanicDashboard />
            </motion.div>
          )}

          {currentView === 'client' && profile && (
            <motion.div
              key="client"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ClientDashboard setView={setCurrentView} />
            </motion.div>
          )}

          {currentView === 'schedule' && profile && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-24 md:py-32 px-6 max-w-5xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
                 <SectionHeading title="Agenda" subtitle="Reserva" />
                 <button 
                  onClick={() => setCurrentView('client')} 
                  className="flex items-center text-[10px] uppercase tracking-widest font-black text-white/40 hover:text-white transition-colors"
                 >
                   Voltar
                 </button>
              </div>
              <ServiceScheduler onSuccess={() => setCurrentView('client')} />
            </motion.div>
          )}

          {currentView === 'register-vehicle' && profile && (
            <motion.div
              key="register-vehicle"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-24 md:py-32 px-6 max-w-5xl mx-auto"
            >
              <VehicleRegistration 
                onSuccess={() => setCurrentView('client')} 
                onCancel={() => setCurrentView('client')} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

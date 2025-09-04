// Analytics tracking utility
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    mixpanel?: any;
    analytics?: any;
  }
}

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // For development, just log to console
  // In production, you would send to your analytics service
  if (typeof window !== 'undefined') {
    console.log('Analytics Event:', eventName, properties);
    
    // Example: Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, properties);
    }
    
    // Example: Send to other analytics services
    // if (window.mixpanel) window.mixpanel.track(eventName, properties);
    // if (window.analytics) window.analytics.track(eventName, properties);
  }
};

// Predefined tracking events
export const analytics = {
  // Hero CTAs
  trackGetStartedClick: () => trackEvent('get_started_clicked', { location: 'hero' }),
  trackBrowseComponentsClick: () => trackEvent('browse_components_clicked', { location: 'hero' }),
  
  // Component previews
  trackViewComponentClick: (componentName: string) => 
    trackEvent('view_component_clicked', { component: componentName }),
  
  // Quick Integration
  trackQuickStartClick: () => trackEvent('quick_start_clicked', { location: 'integration_section' }),
  
  // Final CTA
  trackFinalGetStartedClick: () => trackEvent('get_started_clicked', { location: 'final_cta' }),
  trackGithubClick: () => trackEvent('github_clicked', { location: 'final_cta' }),
  
  // Code copy events
  trackCodeCopy: (step: string) => trackEvent('code_copied', { step }),
};

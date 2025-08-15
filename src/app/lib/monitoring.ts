// Monitoring and Analytics Utilities

export interface MonitoringEvent {
  event: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  properties?: Record<string, any>;
  environment: string;
}

export interface PaymentEvent extends MonitoringEvent {
  event: 'payment_initiated' | 'payment_success' | 'payment_failed' | 'payment_cancelled';
  orderId: string;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface PerformanceMetric {
  metric: string;
  value: number;
  unit: string;
  timestamp: string;
  page?: string;
  userId?: string;
}

// Monitoring configuration
export const MONITORING_CONFIG = {
  enabled: process.env.NODE_ENV === 'production',
  apiEndpoint: process.env.NEXT_PUBLIC_MONITORING_API || '/api/monitoring',
  sampleRate: 1.0, // 100% in production
  maxBatchSize: 10,
  flushInterval: 5000, // 5 seconds
};

// Event tracking
class EventTracker {
  private events: MonitoringEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupAutoFlush();
    }
  }

  private setupAutoFlush() {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, MONITORING_CONFIG.flushInterval);
  }

  track(event: MonitoringEvent) {
    if (!MONITORING_CONFIG.enabled) return;

    this.events.push({
      ...event,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });

    if (this.events.length >= MONITORING_CONFIG.maxBatchSize) {
      this.flush();
    }
  }

  trackPayment(event: PaymentEvent) {
    this.track(event);
  }

  trackPerformance(metric: PerformanceMetric) {
    this.track({
      event: 'performance_metric',
      timestamp: new Date().toISOString(),
      properties: metric,
      environment: process.env.NODE_ENV || 'development',
    });
  }

  trackError(error: Error, context?: Record<string, any>) {
    this.track({
      event: 'error',
      timestamp: new Date().toISOString(),
      properties: {
        message: error.message,
        stack: error.stack,
        ...context,
      },
      environment: process.env.NODE_ENV || 'development',
    });
  }

  private async flush() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      await fetch(MONITORING_CONFIG.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: eventsToSend }),
      });
    } catch (error) {
      console.error('Failed to send monitoring events:', error);
      // Re-add events to queue for retry
      this.events.unshift(...eventsToSend);
    }
  }

  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

// Global event tracker instance
export const eventTracker = new EventTracker();

// Payment monitoring
export const paymentMonitoring = {
  trackInitiated: (orderId: string, amount: number, paymentMethod: string) => {
    eventTracker.trackPayment({
      event: 'payment_initiated',
      orderId,
      amount,
      paymentMethod,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  },

  trackSuccess: (orderId: string, amount: number, paymentMethod: string, transactionId: string) => {
    eventTracker.trackPayment({
      event: 'payment_success',
      orderId,
      amount,
      paymentMethod,
      transactionId,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  },

  trackFailed: (orderId: string, amount: number, paymentMethod: string, errorCode: string, errorMessage: string) => {
    eventTracker.trackPayment({
      event: 'payment_failed',
      orderId,
      amount,
      paymentMethod,
      errorCode,
      errorMessage,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  },

  trackCancelled: (orderId: string, amount: number, paymentMethod: string) => {
    eventTracker.trackPayment({
      event: 'payment_cancelled',
      orderId,
      amount,
      paymentMethod,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  },
};

// Performance monitoring
export const performanceMonitoring = {
  trackPageLoad: (page: string, loadTime: number) => {
    eventTracker.trackPerformance({
      metric: 'page_load_time',
      value: loadTime,
      unit: 'ms',
      page,
      timestamp: new Date().toISOString(),
    });
  },

  trackApiCall: (endpoint: string, responseTime: number, status: number) => {
    eventTracker.trackPerformance({
      metric: 'api_response_time',
      value: responseTime,
      unit: 'ms',
      page: endpoint,
      timestamp: new Date().toISOString(),
    });

    if (status >= 400) {
      eventTracker.trackError(new Error(`API Error: ${status}`), {
        endpoint,
        status,
        responseTime,
      });
    }
  },

  trackPaymentFlow: (step: string, duration: number) => {
    eventTracker.trackPerformance({
      metric: 'payment_flow_step',
      value: duration,
      unit: 'ms',
      page: step,
      timestamp: new Date().toISOString(),
    });
  },
};

// Error monitoring
export const errorMonitoring = {
  trackError: (error: Error, context?: Record<string, any>) => {
    eventTracker.trackError(error, context);
  },

  trackPaymentError: (error: Error, orderId: string, paymentMethod: string) => {
    eventTracker.trackError(error, {
      orderId,
      paymentMethod,
      type: 'payment_error',
    });
  },

  trackApiError: (error: Error, endpoint: string, method: string) => {
    eventTracker.trackError(error, {
      endpoint,
      method,
      type: 'api_error',
    });
  },
};

// User analytics
export const userAnalytics = {
  trackPageView: (page: string, title?: string) => {
    eventTracker.track({
      event: 'page_view',
      timestamp: new Date().toISOString(),
      properties: { page, title },
      environment: process.env.NODE_ENV || 'development',
    });
  },

  trackUserAction: (action: string, properties?: Record<string, any>) => {
    eventTracker.track({
      event: 'user_action',
      timestamp: new Date().toISOString(),
      properties: { action, ...properties },
      environment: process.env.NODE_ENV || 'development',
    });
  },

  trackConversion: (funnel: string, step: string, value?: number) => {
    eventTracker.track({
      event: 'conversion',
      timestamp: new Date().toISOString(),
      properties: { funnel, step, value },
      environment: process.env.NODE_ENV || 'development',
    });
  },
};

// Health check monitoring
export const healthMonitoring = {
  trackHealthCheck: (status: 'healthy' | 'unhealthy', details?: Record<string, any>) => {
    eventTracker.track({
      event: 'health_check',
      timestamp: new Date().toISOString(),
      properties: { status, ...details },
      environment: process.env.NODE_ENV || 'development',
    });
  },

  trackSystemMetric: (metric: string, value: number, unit: string) => {
    eventTracker.trackPerformance({
      metric,
      value,
      unit,
      timestamp: new Date().toISOString(),
    });
  },
};

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    eventTracker.destroy();
  });
}

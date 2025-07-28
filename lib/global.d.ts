declare global {
  interface Window {
    upTag: (eventType: string, eventName: string, data?: any) => void;
    upDataLayer: any[];
  }
}

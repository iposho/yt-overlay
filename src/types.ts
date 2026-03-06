export interface OverlayState {
  theme: {
    primary: string;
    secondary: string;
    text: string;
    accent: string;
  };
  widgets: {
    socials: {
      enabled: boolean;
      twitter: string;
      instagram: string;
      youtube: string;
    };
    logo: {
      enabled: boolean;
      url: string;
      maxWidth: string;
      opacity: number;
    };
    goal: {
      enabled: boolean;
      title: string;
      current: number;
      target: number;
    };
    nowPlaying: {
      enabled: boolean;
      text: string;
    };
    clock: {
      enabled: boolean;
    };
    weather: {
      enabled: boolean;
      location: string;
    };
    debug: {
      enabled: boolean;
      backgroundUrl: string;
    };
    alerts: {
      lastSubscriber: string;
      lastDonation: string;
    };
  };
}

export interface AlertData {
  type: 'SUB' | 'DONATION';
  name: string;
  amount?: string;
}

export type SocketMessage =
  | { type: 'INIT'; state: OverlayState }
  | { type: 'UPDATE_STATE'; state: Partial<OverlayState> }
  | { type: 'STATE_UPDATED'; state: OverlayState }
  | { type: 'TRIGGER_ALERT'; alert: AlertData }
  | { type: 'ALERT'; alert: AlertData };

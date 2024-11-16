export type Notification = {
  timestamp: string;
  from: string;
  to: string[];
  notifID: number;
  channel: {
    name: string;
    icon: string;
    url: string;
  };
  meta: {
    type: string;
  };
  message: {
    notification: {
      title: string;
      body: string;
    };
    payload: {
      title: string;
      body: string;
      cta: string;
      embed: string;
      meta: {
        domain: string;
      };
    };
  };
  config: {
    expiry: string | null;
    silent: boolean;
    hidden: boolean;
  };
  source: string;
  raw: {
    verificationProof: string;
  };
};

export type UserChannel = {
  notifications: Notification[];
  total: number;
};

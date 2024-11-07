export interface Description {
    summary: string;
    fullDescription: string;
    format: 'plain' | 'html' | 'markdown';
  }

  export interface Subscription {
    id: string;
    user_id: string;
    product_id: string;
    status: 'active' | 'inactive';
    start_date: string;
    end_date: string;
    stripe_subscription_id: string;
    created_at: string;
    updated_at: string;
    payment_intent_id: string | null;
  }

  export interface BlogPost {
    [x: string]: string;
    title: string;
    date: string;
    excerpt: string;
    author: string;
    slug: string;
  }
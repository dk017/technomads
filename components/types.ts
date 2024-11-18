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

  // export interface Job {
  //   id: number;
  //   title: string;
  //   description: string;
  //   short_description?: string;
  //   company_name: string;
  //   company_url?: string;
  //   company_size?: string;
  //   logo_url?: string;
  //   job_url: string;
  //   job_slug?: string;

  //   // Location details
  //   country: string;
  //   city?: string;
  //   location?: string;

  //   // Job details
  //   employment_type: string;  // e.g., "Full-time", "Part-time", "Contract"
  //   category?: string;
  //   experience?: string;
  //   salary?: string | number;
  //   salary_range?: {
  //     min?: number;
  //     max?: number;
  //     currency?: string;
  //   };

  //   // Additional features
  //   skills?: string[];
  //   visa_sponsorship?: boolean;
  //   remote_level?: string;  // e.g., "Full Remote", "Hybrid", "On-site"

  //   // Formatted content
  //   formatted_description?: {
  //     sections: {
  //       title: string;
  //       items: string[];
  //     }[];
  //   };

  //   // Meta information
  //   created_at: string;
  //   updated_at?: string;
  //   published_at?: string;
  //   status?: 'active' | 'inactive' | 'draft';

  //   // Application details
  //   how_to_apply?: string;
  //   application_url?: string;

  //   // Optional company details
  //   company_description?: string;
  //   company_industry?: string;
  //   company_benefits?: string[];
  // }


  export interface Job {
    id: number;
    title: string;
    country: string;
    skills: string[];
    visa_sponsorship: boolean;
    company_name: string;
    company_size: string;
    employment_type: string;
    salary: string;
    logo_url: string;
    job_url: string;
    short_description: string;
    description: string;
    category: string;
    company_url: string;
    experience: string;
    city: string;
    job_slug: string;
    formatted_description: {
      sections: {
        title: string;
        items: string[];
      }[];
    };
  }

  export interface FilterParams {
    location: string;
    keyword: string;
    title: string;
    category?: string;
    minSalary?: string;
    employment_type?: string;
    remote_level?: string;
    experience_level?: string;
  }

  // You might also want to add these related types
  export interface JobSection {
    title: string;
    items: string[];
  }

  export interface SalaryRange {
    min?: number;
    max?: number;
    currency?: string;
  }

  export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';

  export type RemoteLevel = 'Full Remote' | 'Hybrid' | 'On-site';

  export type ExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior' | 'Lead' | 'Executive';
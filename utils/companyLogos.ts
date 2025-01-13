import { createClient } from "@/app/utils/supabase/client";

export const getCompanyLogoUrl = async (companyName: string): Promise<string> => {
  const supabase = createClient();

  try {
    // Get logo filename from companies table
    const { data: company, error } = await supabase
      .from('companies')
      .select('logo_filename')
      .eq('name', companyName)
      .single();

    if (error) {
      console.log('Error fetching company:', error);
      return '/default-company-logo.png';
    }

    // If no logo filename in database, return default
    if (!company?.logo_filename) {
      console.log('No logo filename for company:', companyName);
      return '/default-company-logo.png';
    }

    // Get public URL for the logo
    const { data } = await supabase
      .storage
      .from('organization-logos')
      .getPublicUrl(company.logo_filename);

    if (data?.publicUrl) {
      console.log('Found logo for:', companyName, 'Filename:', company.logo_filename);
      return data.publicUrl;
    }

    return '/default-company-logo.png';
  } catch (error) {
    console.error('Error fetching logo:', error, 'Company:', companyName);
    return '/default-company-logo.png';
  }
};
export default function JobsLayout({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: { companyName: string };
  }) {
    console.log("DEBUG: Jobs layout mounted", params);
    return <div>{children}</div>;
  }
export default function CompaniesLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    console.log("DEBUG: Companies layout mounted");
    return <div>{children}</div>;
  }
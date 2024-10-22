import React from "react";
import Link from "next/link";

const popularCategories = [
  "Senior Software",
  "Staff Software Engineer",
  "Software Development Engineer",
  "Backend Developer",
  "Data Science",
  "UI/UX Design",
  "Digital Marketing",
  "Content Writing",
  "Customer Support",
  "Project Management",
  "Product Management",
  "Sales",
  "DevOps",
  "Quality Assurance",
  "Business Analysis",
  "Graphic Design",
  "SEO Specialist",
  "Social Media Management",
  "Virtual Assistant",
  "Cybersecurity",
  "Machine Learning",
  "Mobile App Development",
];

const remoteDeveloperJobs = [
  "Software Engineer",
  "DevOps Engineer",
  "Technical Support Engineer",
  "Software Engineering Manager",
  "Support Engineer",
  "QA Engineer",
  "Solutions Engineer",
  "Developer",
  "Full Stack Engineer",
  "Front End Developer",
  "Security Engineer",
  "QA Test Engineer",
  "Solutions Architect",
  "QA Automation Engineer",
  "Quality Assurance Analyst",
  "Back End Developer",
  "Site Reliability Engineer",
  "QA Analyst",
];

const remoteSalesJobs = [
  "Account Executive",
  "Account Manager",
  "Sales Manager",
  "Sales Development Representative",
  "Client Success Manager",
  "Regional Sales Manager",
  "Account Director",
  "Sales Representative",
  "Business Development Manager",
  "Business Development Representative",
  "Enterprise Account Executive",
  "Area Sales Manager",
  "Enterprise Sales Executive",
  "Sales Director",
  "Territory Sales Manager",
  "Strategic Account Manager",
  "Director of Sales",
  "Sales Associate",
  "Business Data Analyst",
  "Enterprise Sales Director",
  "Sales Development Associate",
  "Sales Executive",
  "Mid Market Account Executive",
  "Sales Engineer",
];

const remoteProductJobs = [
  "Product Manager",
  "Program Manager",
  "Technical Program Manager",
  "Lead Product Manager",
  "Product Owner",
  "Associate Project Manager",
  "Director of Product",
  "Technical Product Manager",
  "Program Coordinator",
  "Product Analyst",
  "Group Product Manager",
  "Scrum Master",
  "Associate Product Manager",
  "Digital Project Manager",
  "Growth Product Manager",
  "Product Development Manager",
  "Product Lead",
  "Product Operations Manager",
  "Junior Product Manager",
];

const remoteCustomerSupportJobs = [
  "Customer Service",
  "Customer Success Manager",
  "Customer Service Representative",
  "Customer Support Representative",
  "Customer Care Representative",
  "Customer Support Agent",
  "Customer Success Lead",
  "Customer Service Associate",
  "Customer Support Specialist",
  "Customer Service Agent",
  "Customer Support Associate",
  "Technical Support Specialist",
  "Customer Support",
  "Technical Support Representative",
  "Director of Customer Success",
  "Customer Success Specialist",
  "Customer Success Associate",
  "Customer Support Engineer",
  "Enterprise Account Manager",
  "Key Account Manager",
  "Implementation Specialist",
  "Customer Success Representative",
];

const remoteDesignJobs = [
  "UI/UX Designer",
  "Graphic Designer",
  "UI Designer",
  "Lead Product Designer",
  "Product Designer",
  "Junior Graphic Designer",
  "UX Designer",
  "Graphic Web Designer",
  "UI UX Designer",
  "Project Development Manager",
  "Web Designer",
  "Illustrator",
  "Design Director",
  "UI Designer",
  "Director of Design",
];

const remoteMarketingJobs = [
  "Marketing Manager",
  "Product Marketing Manager",
  "Social Media Marketing Manager",
  "Marketing Associate",
  "Marketing Director",
  "Partnerships Manager",
  "Marketing Assistant",
  "Strategic Partnerships Manager",
  "Digital Marketing Manager",
  "Marketing Specialist",
  "Marketing Coordinator",
  "Research Associate",
  "Marketing Data Analyst",
  "Head of Marketing",
  "Research Analyst ",
];

const remoteOperationsJobs = [
  "Project Manager",
  "Operations Associate",
  "IT Project Manager",
  "Operations Manager",
  "Operations Specialist",
  "Project Coordinator",
  "Technical Project Manager",
  "Operations Coordinator",
  "IT Support Specialist",
  "Operations Analyst",
  "Business Operations Manager",
  "Systems Engineer",
  "Operations",
  "Systems Administrator",
  "Director of Operations",
  "System Administrator",
  "Junior Project Manager",
  "IT Manager",
  "Data Entry Specialist",
  "Supply Chain Analyst",
  "Operations Lead",
  "IT Administrator",
  "Supply Chain Manager",
  "Linux Engineer",
  "Logistics Manager",
];

const remoteFinanceJobs = [
  "Accountant",
  "Finance Manager",
  "Accounting Manager",
  "Financial Analyst",
  "Director of Finance",
  "Financial Accountant",
  "Director of Accounting",
  "Finance",
  "Head of Finance",
  "Junior Analyst",
  "Staff Accountant",
  "Financial Manager",
  "Accounting Associate",
  "Credit Risk Analyst",
  "Bookkeeper",
  "Financial Controller",
  "Business Consultant",
  "Investment Analyst",
  "Finance Associate",
];

const remoteHumanResourcesJobs = [
  "Administrative Assistant",
  "Executive Assistant",
  "Recruiter",
  "Virtual Assistant",
  "Office Assistant",
  "Talent Acquisition Specialist",
  "Recruitment Specialist",
  "Talent Acquisition Manager",
  "Office Administrator",
  "Human Resources",
  "Contract Recruiter",
  "HR Manager",
  "Technical Recruiter",
  "People Operations Manager",
  "Recruitment Manager",
  "Lead Recruiter",
  "Personal Assistant",
  "HR Generalist",
  "IT Recruiter",
  "Recruiting Coordinator",
];

const remoteDataScienceJobs = [
  "Business Analyst",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "Lead Data Scientist",
  "Data Science Analyst",
  "Data Analytics Manager",
  "Business Intelligence Analyst",
  "Machine Learning Scientist",
  "Technical Business Analyst",
  "Analytics Manager",
  "Research Scientist",
  "Principal Data Scientist",
  "Data Science",
  "Business intelligence Engineer",
  "Machine Learning Lead",
  "Business Intelligence Manager",
];

const remoteContentCreatorJobs = [
  "Content Creator",
  "Content Writer",
  "Video Editor",
  "Technical Writer",
  "Technical Content Writer",
  "Content Editor",
  "Social Media Content Creator",
  "Video Producer",
  "Copywriter",
  "Content Marketing Specialist",
  "Content Manager",
  "Content Marketer",
  "Content Specialist",
  "Content Developer",
  "Editor",
  "Content Strategist",
  "Content Marketing Associate",
];

const remoteLegalJobs = [
  "Compliance Manager",
  "Compliance Analyst",
  "Risk Analyst",
  "Corporate Counsel",
  "Risk Manager",
  "Paralegal",
  "Legal",
  "General Counsel",
  "Attorney",
  "Lawyer",
];

const remoteManagementJobs = [
  "Chief of Staff",
  "Business Manager",
  "Management",
  "General Manager",
  "Country Manager",
  "Chief Operating Officer (COO)",
  "Associate General Manager",
  "Entrepreneur",
  "Management Trainee",
];

const remoteJobsByCountry = [
  "United States",
  "United Kingdom",
  "Canada",
  "India",
  "Germany",
  "Philippines",
  "Poland",
  "Spain",
  "Mexico",
  "Brazil",
  "Portugal",
  "France",
  "Ireland",
  "Australia",
  "Argentina",
  "Romania",
  "Colombia",
];
const jobCategories = [
  {
    title: "Popular Categories",
    jobs: popularCategories,
    description:
      "Explore the most sought-after remote job categories across various industries, offering flexibility and work-from-home opportunities.",
  },
  {
    title: "Developer Jobs",
    jobs: remoteDeveloperJobs,
    description:
      "Software development roles for professionals skilled in coding, programming, and creating innovative digital solutions for businesses worldwide.",
  },
  {
    title: "Sales Jobs",
    jobs: remoteSalesJobs,
    description:
      "Remote sales positions for driven individuals to generate leads, close deals, and grow business revenue from anywhere in the world.",
  },
  {
    title: "Product Jobs",
    jobs: remoteProductJobs,
    description:
      "Product management and development roles for professionals who can strategize, plan, and execute product lifecycles remotely.",
  },
  {
    title: "Customer Support Jobs",
    jobs: remoteCustomerSupportJobs,
    description:
      "Customer service positions for empathetic individuals to assist clients, resolve issues, and ensure customer satisfaction from a remote setting.",
  },
  {
    title: "Design Jobs",
    jobs: remoteDesignJobs,
    description:
      "Creative roles for designers to conceptualize and produce visually appealing content and user experiences for digital platforms.",
  },
  {
    title: "Marketing Jobs",
    jobs: remoteMarketingJobs,
    description:
      "Marketing positions for professionals to develop and implement strategies to promote products, services, and brands in the digital landscape.",
  },
  {
    title: "Operations Jobs",
    jobs: remoteOperationsJobs,
    description:
      "Operational roles for individuals to manage and optimize business processes, ensuring smooth functioning of remote teams and projects.",
  },
  {
    title: "Finance Jobs",
    jobs: remoteFinanceJobs,
    description:
      "Financial positions for professionals to manage budgets, analyze financial data, and provide strategic financial guidance remotely.",
  },
  {
    title: "Human Resources Jobs",
    jobs: remoteHumanResourcesJobs,
    description:
      "HR roles for professionals to manage personnel, recruitment, training, and employee relations in remote or distributed work environments.",
  },
  {
    title: "Data Science Jobs",
    jobs: remoteDataScienceJobs,
    description:
      "Data-driven positions for analysts and scientists to interpret complex data sets and provide valuable insights for business decision-making.",
  },
  {
    title: "Content Creator Jobs",
    jobs: remoteContentCreatorJobs,
    description:
      "Creative roles for writers, editors, and multimedia content producers to develop engaging content for various digital platforms.",
  },
  {
    title: "Legal Jobs",
    jobs: remoteLegalJobs,
    description:
      "Legal positions for professionals to provide legal advice, ensure compliance, and manage legal risks for businesses operating remotely.",
  },
  {
    title: "Management Jobs",
    jobs: remoteManagementJobs,
    description:
      "Leadership roles for experienced professionals to guide teams, develop strategies, and drive business growth in remote work settings.",
  },
  {
    title: "Jobs by Country",
    jobs: remoteJobsByCountry,
    description:
      "Explore remote job opportunities available in different countries, allowing you to work for global companies from your preferred location.",
  },
];

export default function TopRemoteJobCategories() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-100">
        Top Remote Job Categories
      </h1>
      {jobCategories.map((category, index) => (
        <div key={index} className="mb-12">
          <h2 className="text-2xl font-semibold mb-2 text-gray-200">
            {category.title}
          </h2>
          <p className="text-gray-400 mb-4">{category.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            {category.jobs.map((job, jobIndex) => (
              <div key={jobIndex}>
                <Link
                  href={`/jobs/${encodeURIComponent(
                    job.toLowerCase().replace(/ /g, "-")
                  )}`}
                  className="text-cyan-300 hover:text-cyan-100 transition-colors duration-200"
                >
                  {job}
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
